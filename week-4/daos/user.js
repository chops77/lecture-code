const User = require('../models/user');

module.exports = {};

module.exports.getAll = (page, perPage) => {
  return User.find().limit(perPage).skip(perPage*page).lean();
}

module.exports.getById = (userId) => {
  return User.findOne({ id_: userId }).lean();
}

module.exports.deleteById = (userId) => {
  return User.deleteOne({ userId });
}

module.exports.updateById = (userId, newObj) => {
  return User.updateOne({ userId }, newObj);
}

module.exports.create = (userData) => {
  return User.create(userData);
}