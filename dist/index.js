"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("reflect-metadata");

var _typeorm = require("typeorm");

var _User = require("./entity/User");

(0, _typeorm.createConnection)().then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
    var user, users;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Inserting a new user into the database...");
            user = new _User.User();
            user.firstName = "Timber";
            user.lastName = "Saw";
            user.age = 25;
            _context.next = 7;
            return connection.manager.save(user);

          case 7:
            console.log("Saved a new user with id: " + user.id);
            console.log("Loading users from the database...");
            _context.next = 11;
            return connection.manager.find(_User.User);

          case 11:
            users = _context.sent;
            console.log("Loaded users: ", users);
            console.log("Here you can setup and run express/koa/any other framework.");

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}())["catch"](function (error) {
  return console.log(error);
});