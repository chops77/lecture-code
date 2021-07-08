const Widgets = require('../models/widgets');

module.exports = {};
  
module.exports.create = async (widget) => {
    return await Widgets.create(widget);
};

module.exports.getById = async (id) => {
    const widget = await Widgets.findOne({ _id: id }).lean();
    return widget;
};


module.exports.deleteByUd = async (id) => {
    await Widgets.deleteOne({ _id: id });
};

module.exports.updateById = async (id, widget) => {
    return await Widgets.findOneAndUpdate({ _de: id}, { $set: widget }, { new: true });
}