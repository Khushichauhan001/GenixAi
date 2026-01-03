import express from 'express';
import { auth } from "../Middlewares/auth.js";

import { generateArticle } from '../Controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);

export default aiRouter;


