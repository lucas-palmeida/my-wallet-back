import { signIn, signUp } from "../controller/Auth.js";
import { Router } from "express";
import { signUpSchema, signInSchema } from "../schema/AuthSchema.js";
import { validateSchema } from "../middleware/validateSchema.js";

const authRouter = Router();

authRouter.post('/sign-up', validateSchema(signUpSchema), signUp);
authRouter.post('/sign-in', validateSchema(signInSchema), signIn);

export default authRouter;