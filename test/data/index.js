var mongoose = require('lib/mongoose');
var async = require('async');
var fixtures = require('pow-mongoose-fixtures');

function createEmptyDb(callback) {

  async.series([
    function open(callback) {
      if (mongoose.connection.readyState == 1) { // already connected
        return callback();
      } else {
        mongoose.connection.on('open', callback);
      }
    },
    function clearDatabase(callback) {
      // db.dropDatabase reallocates file and is slow
      // that's why we drop collections one-by-one
      var db = mongoose.connection.db;
      db.collectionNames(function(err, collections) {
        async.each(collections, function(collection, callback) {
          if (~collection.name.indexOf('.system.')) return callback();
          var name = collection.name.slice(db.databaseName.length + 1);
          db.dropCollection(name, callback);
        }, callback);
      });
    },
    function requireModels(callback) {
      require('models');
      async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
      }, callback);
    }
  ], function(err) {
    callback(err);
  });
}

exports.createEmptyDb = createEmptyDb;

/**
 * Clear database,
 * require models & wait until indexes are created,
 * then load data from test/data/dataFile.json & callback
 * @param dataFile
 * @param callback
 */
exports.loadDb = function(dataFile, callback) {

  async.series([
    createEmptyDb,
    function fillDb(callback) {
      var modelsData = require('test/data/' + dataFile);
      fixtures.load(modelsData, mongoose.connection, callback);
    }
  ], function(err) {
    callback(err);
  });

};