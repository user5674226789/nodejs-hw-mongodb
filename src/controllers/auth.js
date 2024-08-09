// src/controllers/auth.js

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res, next) => {
  console.log('Cookies:', req.cookies);
  const sessionId = req.cookies.sessionId;
  console.log('Session ID:', sessionId);

  if (!sessionId || !isValidObjectId(sessionId)) {
    return next(createHttpError(400, 'Invalid session ID'));
  }

  const sessionExists = await logoutUser(sessionId);

  if (!sessionExists) {
    return next(createHttpError(404, 'Session not found'));
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.sendStatus(204);
};

export const refreshUserSessionController = async (req, res, next) => {
  console.log('Cookies:', req.cookies);
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;
  console.log('Session ID:', sessionId);
  console.log('Refresh Token:', refreshToken);

  if (!sessionId || !refreshToken) {
    return next(createHttpError(400, 'Missing session ID or refresh token'));
  }

  const session = await refreshUsersSession({
    sessionId,
    refreshToken,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY * 30),
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestResetToken(email);
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    if (error.status === 404) {
      return next(createHttpError(404, 'User not found!'));
    }
    return next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    if (error.status === 401) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }
    if (error.status === 404) {
      return next(createHttpError(404, 'User not found!'));
    }
    return next(
      createHttpError(
        500,
        'Failed to reset the password, please try again later.',
      ),
    );
  }
};
