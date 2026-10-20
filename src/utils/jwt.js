import jwt from 'jsonwebtoken';

const KEY = process.env.JWT_SECRET

export function generateToken(userInfo) {
  const payload = {
    role: 'user',
    ...userInfo
  };

  return jwt.sign(payload, KEY, { expiresIn: '8h' });
}

function extractToken(req) {
  let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query['x-access-token'];

  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.substring(7);
  }

  return token;
}

export function getTokenInfo(req) {
  try {
    const token = extractToken(req);
    return jwt.verify(token, KEY);
  } catch {
    return null;
  }
}

export function getAuthentication(checkRole, throw401 = true) {  
  return (req, resp, next) => {
    try {
      const token = extractToken(req);

      if (!token) {
        throw new Error('Token não fornecido');
      }

      const signd = jwt.verify(token, KEY);
      req.user = signd;

      if (checkRole && !checkRole(signd) && signd.role !== 'admin') {
        return resp.status(403).send({ erro: 'Acesso negado. Permissão insuficiente.' });
      }

      next();
    } catch (err) {
      if (throw401) {
        return resp.status(401).send({ erro: 'Token inválido, expirado ou ausente.' });
      } else {
        next();
      }
    }
  };
}