"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestResetEmailController = exports.refreshUserSessionController = exports.logoutUserController = exports.loginUserController = exports.registerUserController = void 0;

var _auth = require("../services/auth.js");

var _index = require("../constants/index.js");

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/controllers/auth.js
var registerUserController = function registerUserController(req, res) {
  var user;
  return regeneratorRuntime.async(function registerUserController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _auth.registerUser)(req.body));

        case 2:
          user = _context.sent;
          res.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: user
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.registerUserController = registerUserController;

var loginUserController = function loginUserController(req, res) {
  var session;
  return regeneratorRuntime.async(function loginUserController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap((0, _auth.loginUser)(req.body));

        case 2:
          session = _context2.sent;
          res.cookie('refreshToken', session.refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + _index.ONE_DAY * 30)
          });
          res.cookie('sessionId', session._id, {
            httpOnly: true,
            expires: new Date(Date.now() + _index.ONE_DAY * 30)
          });
          res.json({
            status: 200,
            message: 'Successfully logged in an user!',
            data: {
              accessToken: session.accessToken
            }
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.loginUserController = loginUserController;

var logoutUserController = function logoutUserController(req, res, next) {
  var sessionId, sessionExists;
  return regeneratorRuntime.async(function logoutUserController$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log('Cookies:', req.cookies);
          sessionId = req.cookies.sessionId;
          console.log('Session ID:', sessionId);

          if (!(!sessionId || !(0, _mongoose.isValidObjectId)(sessionId))) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", next((0, _httpErrors["default"])(400, 'Invalid session ID')));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap((0, _auth.logoutUser)(sessionId));

        case 7:
          sessionExists = _context3.sent;

          if (sessionExists) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", next((0, _httpErrors["default"])(404, 'Session not found')));

        case 10:
          res.clearCookie('sessionId');
          res.clearCookie('refreshToken');
          res.sendStatus(204);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.logoutUserController = logoutUserController;

var refreshUserSessionController = function refreshUserSessionController(req, res, next) {
  var sessionId, refreshToken, session;
  return regeneratorRuntime.async(function refreshUserSessionController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log('Cookies:', req.cookies);
          sessionId = req.cookies.sessionId;
          refreshToken = req.cookies.refreshToken;
          console.log('Session ID:', sessionId);
          console.log('Refresh Token:', refreshToken);

          if (!(!sessionId || !refreshToken)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", next((0, _httpErrors["default"])(400, 'Missing session ID or refresh token')));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap((0, _auth.refreshUsersSession)({
            sessionId: sessionId,
            refreshToken: refreshToken
          }));

        case 9:
          session = _context4.sent;
          res.cookie('refreshToken', session.refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + _index.ONE_DAY * 30)
          });
          res.cookie('sessionId', session._id, {
            httpOnly: true,
            expires: new Date(Date.now() + _index.ONE_DAY * 30)
          });
          res.json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {
              accessToken: session.accessToken
            }
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.refreshUserSessionController = refreshUserSessionController;

var requestResetEmailController = function requestResetEmailController(req, res) {
  return regeneratorRuntime.async(function requestResetEmailController$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap((0, _auth.requestResetToken)(req.body.email));

        case 2:
          res.json({
            message: 'Reset password email was successfully sent!',
            status: 200,
            data: {}
          });

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.requestResetEmailController = requestResetEmailController;