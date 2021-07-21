const Transaction = require('../models/transaction');
const mongoose = require('mongoose');

module.exports = {};

module.exports.getUserStats = (userId, startDate, endDate) => {
  const filter = { userId: mongoose.Types.ObjectId(userId) };
  if (startDate) {
    filter.date = { $gte: new Date(startDate) };
  }
  if (endDate) {
    filter.date = { $lt: new Date(endDate) };
  }
  console.log(filter)
  return Transaction.aggregate([
    { $match: filter },
    { $group: { _id: '$userId', count: { $sum: 1 }, sum: { $sum: '$charge' } }}
  ])
}

module.exports.getAll = (userId, page, perPage) => {
  return Transaction.find({ userId }).limit(perPage).skip(perPage*page).lean();
}

module.exports.getById = (userId, transactionId) => {
  return Transaction.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(transactionId), userId: mongoose.Types.ObjectId(userId) }},
    { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }},
    { $unwind: '$user'}
  ]);
}

module.exports.deleteById = (userId, transactionId) => {
  return Transaction.deleteOne({ _id: transactionId, userId });
}

module.exports.updateById = (userId, transactionId, newObj) => {
  return Transaction.update({ _id: transactionId, userId }, newObj);
}

module.exports.create = (transactionData) => {
  return Transaction.create(transactionData);
}