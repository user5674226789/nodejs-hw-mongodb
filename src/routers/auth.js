import {Router} from 'express'
import {ctrlWrapper} from "../utils/ctrlWrapper.js"
import { registerUserController } from '../controllers/auth.js'
import { validateBody } from '../middlewares/validateBody.js'
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { loginUserController } from "../controllers/auth.js";
import { registerUserSchema } from "../validation/auth.js";
import { loginUserSchema} from "../validation/auth.js";

const router = Router();

router.post(
  '/auth/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/auth/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));
export default router;
