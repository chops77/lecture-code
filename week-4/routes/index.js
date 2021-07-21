const { Router } = require("express");
const router = Router();

router.use((req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    next();
});

router.use("/users", require('./users'));
router.use("/users/:userId/transactions", require('./transactions'));

module.exports = router;
