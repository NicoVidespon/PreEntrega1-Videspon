import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

import { configObject } from '../config/index.js';

const PRIVATE_KEY = configObject.privateKey || 'CoderKeyFuncionSecrte';

export const generateToken = (userDataToken) => 
  sign(userDataToken, PRIVATE_KEY, { expiresIn: '1d' });

export const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ status: 'error', error: 'no token provided' });
  }

  const token = authHeader.split(' ')[1];

  verify(token, PRIVATE_KEY, (error, userDecode) => {
    if (error) return res.status(401).send({ status: 'error', error: 'not authorized' });
    req.user = userDecode;
    next();
  });
};

export const privateKey = PRIVATE_KEY;
