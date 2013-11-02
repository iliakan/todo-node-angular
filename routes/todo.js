var Todo = require('models/todo').Todo;
var auth = require('lib/middleware/auth');
var mongoose = require('lib/mongoose');
var async = require('async');
var HttpError = require('lib/error').HttpError;

module.exports = function(app) {

  app.get('/todo', auth.mustBeAuthenticated, function(req, res) {
    res.render('todo');
  });

  app.get('/api/todos/byUser/:userId', auth.userIdMustBeCurrentUser,
    function(req, res, next) {

      return Todo.find({user: req.params.userId}, function(err, todos) {
        if (err) return next(err);
        res.json(todos);
      });
    }
  );

  app.post('/api/todos/:_id', auth.mustBeAuthenticated,
    function(req, res, next) {
      var search = { _id: req.params._id, user: req.user.id };

      async.waterfall([
        function(callback) {
          Todo.findOne(search, callback);
        },
        function(todo, callback) {
          if (!todo) return next(404);
          todo.done = req.body.done;
          todo.priority = req.body.priority;
          todo.text = req.body.text;
          todo.dueDate = req.body.dueDate;
          todo.validate(function(err) {
            if (err) {
              return next(new HttpError(400, "Invalid data"));
            }
            callback(null, todo);
          });
        },
        function(todo, callback) {
          todo.save(callback)
        },
        function(todo, affected) {
          res.json(todo)
        }
      ], function(err) {
        if (err) return next(err);
      });

    }
  );


  app.post('/api/todos', auth.mustBeAuthenticated,
    function(req, res, next) {

      var $set = {
        done: req.body.done,
        priority: req.body.priority,
        text: req.body.text,
        dueDate: req.body.dueDate,
        user: req.user.id
      };

      Todo.create($set, function(err, todo) {
        if (err) return next(err);
        res.json(todo);
      });

    }
  );


  app.delete('/api/todos/:_id', auth.mustBeAuthenticated,
    function(req, res, next) {
      var search = { _id: req.params._id, user: req.user.id };

      Todo.remove(search, function(err, affected) {
        if (err) return next(err);
        if (!affected) {
          res.send(404);
        } else {
          res.send(200);
        }
      });

    }
  );

};