module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('users').find({}, { _id: 1, transactions: 1 }).forEach((user, callback) => {
      const { _id, transactions } = user;
      transactions.forEach((transaction) => {
        transaction.userId = _id;
      });
      if (transactions.length > 0) {
        db.collection('transactions').insertMany(transactions).then(callback);
      }
    });
    await db.collection('users').updateMany({}, { $unset: { transactions: true }});
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
