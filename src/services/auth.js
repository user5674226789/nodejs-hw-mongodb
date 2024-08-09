// src/services/auth.js

import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

import jwt from 'jsonwebtoken';
// import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

// import handlebars from 'handlebars';
// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { TEMPLATES_DIR } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({
    userId: user._id,
  });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY * 30),
  });
};

export const logoutUser = async (sessionId) => {
  try {
    const session = await SessionsCollection.findById(sessionId);

    if (!session) {
      return false; // Session not found
    }

    await SessionsCollection.findByIdAndDelete(sessionId);
    return true; // Session deleted successfully
  } catch (error) {
    console.error('Error in logoutUser service:', error);
    throw error;
  }
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY * 30),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  console.log(
    'Refreshing session with sessionId:',
    sessionId,
    'and refreshToken:',
    refreshToken,
  );

  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    console.log('Session not found');
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    console.log('Session token expired');
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  // Invalidate the current session
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const createdSession = await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });

  console.log('New session created:', createdSession);

  return createdSession;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const resetUrl = `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`;

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const { email } = decoded;

  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  await SessionsCollection.deleteMany({ userId: user._id });

  return user;
};
