import { Router } from 'express';
import AuthRoute from './Auth';
import UserRoute from './User';

const router = Router();

router.use('/auth', AuthRoute);
router.use('/user', UserRoute);

export default router;
