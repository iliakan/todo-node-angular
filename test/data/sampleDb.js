exports.User = [
  { "_id": "000000000000000000000001", "email": "a@mail.com", "password": "123" },
  { "_id": "000000000000000000000002", "email": "b@mail.com", "password": "123" }
];

exports.Todo = [
  { "_id": "000000000000000000000003",
    "done": true,
    "priority": 1,
    "text": "Task 1",
    "dueDate": new Date(2013, 10, 1),
    "user": "000000000000000000000001"
  },
  { "_id": "000000000000000000000004",
    "done": false,
    "priority": 0,
    "text": "Task 2",
    "dueDate": new Date(2013, 10, 3),
    "user": "000000000000000000000001"
  },
  { "_id": "000000000000000000000005",
    "done": true,
    "priority": 2,
    "text": "Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3 Long Long Task 3",
    "dueDate": new Date(2013, 10, 2),
    "user": "000000000000000000000001"
  },
  { "_id": "000000000000000000000006",
    "done": true,
    "priority": 2,
    "text": "Task 3",
    "dueDate": new Date(2013, 10, 2),
    "user": "000000000000000000000002"
  }
];
