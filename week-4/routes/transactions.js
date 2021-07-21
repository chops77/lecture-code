const { Router } = require("express");
const router = Router({ mergeParams: true });

const transactionDAO = require('../daos/transaction');
const userDAO = require('../daos/user');

router.use(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userDAO.getById(userId);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    req.user = user;
    next();
  }
});

// Create
router.post("/", async (req, res, next) => {
  const userId = req.params.userId;
  const transaction = req.body;
  transaction.userId = userId;
  if (!transaction || JSON.stringify(transaction) === '{}' ) {
    res.status(400).send('transaction is required');
  } else {
    try {
      const savedtransaction = await transactionDAO.create(transaction);
      res.json(savedtransaction); 
    } catch(e) {
      res.status(500).send(e.message);
    }
  }
});

// Read - single transaction
router.get("/:id", async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const transaction = await transactionDAO.getById(req.user._id, req.params.id);
    // TODO populate user field in response with actual user data
    if (transaction) {
      res.json(transaction);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next(e);
  }
});

// Read - all transactions
router.get("/", async (req, res, next) => {
  const userId = req.params.userId;
  let { page, perPage } = req.query;
  page = page ? Number(page) : 0;
  perPage = perPage ? Number(perPage) : 10;
  const transactions = await transactionDAO.getAll(userId, page, perPage);
  res.json(transactions);
});

// Update
router.put("/:id", async (req, res, next) => {
  const userId = req.params.userId;
  const transactionId = req.params.id;
  const transaction = req.body;
  transaction.userId = userId;
  if (!transaction || JSON.stringify(transaction) === '{}' ) {
    res.status(400).send('transaction is required"');
  } else {
    try {
      const updatedtransaction = await transactionDAO.updateById(userId, transactionId, transaction);
      res.json(updatedtransaction);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const userId = req.params.userId;
  const transactionId = req.params.id;
  try {
    await transactionDAO.deleteById(userId, transactionId);
    res.sendStatus(200);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

router.use(function (err, req, res, next) {
  if (err.message.includes("Cast to ObjectId failed")) {
    res.status(400).send('Invalid id provided');
  } else {
    res.status(500).send('Something broke!')}
});

module.exports = router;
