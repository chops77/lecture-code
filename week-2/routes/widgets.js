const { Router } = require("express");
const router = Router();

const WidgetDAO = require('../daos/widgets');

// Create
router.post("/", async (req, res, next) => {
  try {
    const widget = req.body;
    if (!widget || JSON.stringify(widget) === '{}' ) {
      res.status(400).send('widget is required');
    } else {
      //save widget here
      const savedWidget = await WidgetDAO.create(widget);
      res.json(savedWidget);
    }
  } catch (e) {
    if (e.message.includes('validation failed:')) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send('Unexpected Server Error');
    }
  }
});

// Read - single widget
router.get("/:id", async (req, res, next) => {
  const widgetId = req.params.id;
  const widget = await WidgetDAO.getById(widgetId); // get widget here;
  if (widget) {
    res.json(widget);
  } else {
    res.sendStatus(404);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  const widgetId = req.params.id;
  const widget = req.body;
  if (!widget || JSON.stringify(widget) === '{}' ) {
    res.status(400).send('widget is required"');
  } else {
    //update widget here
    const result = await WidgetDAO.updateById(widgetId, widget);
    res.json(result);
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const widgetId = req.params.id;
  await WidgetDAO.deleteByUd(widgetId);
  res.sendStatus(200);
});

module.exports = router;