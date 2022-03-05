import { Router } from 'express';
import AuthRoute from './Auth';

const router = Router();

router.use('/auth', AuthRoute);

export default router;
