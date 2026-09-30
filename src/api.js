import './utils/global.js';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AddRoutes } from './routes.js';

import connection from './repository/connection.js';

const api = express();
api.use(cors());
api.use(express.json());

AddRoutes(api);

const PORT = process.env.PORT;
api.listen (PORT, () => console.log(`-- A API subiu na porta ${PORT} --`));