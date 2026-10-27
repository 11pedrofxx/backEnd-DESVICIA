import 'dotenv/config';
import './utils/global.js';
import express from 'express';
import cors from 'cors';
import { AddRoutes } from './routes.js';

import connection from './repository/connection.js';

const api = express();
api.use(cors());
api.use(express.json());

AddRoutes(api);
console.log('Host do Brevo:', process.env.BREVO_HOST);
console.log('Usuário do Brevo:', process.env.BREVO_USER);

const PORT = process.env.PORT;
api.listen (PORT, () => console.log(`-- A API subiu na porta ${PORT} --`));