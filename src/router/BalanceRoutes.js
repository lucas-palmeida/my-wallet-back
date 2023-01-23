import { getBalance, newEntry } from "../controller/Balance.js";
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema.js";
import { entriesSchema } from "../schema/EntrySchema.js";
import { authValidation } from "../middleware/AuthMiddleware.js";

const balanceRouter = Router();

balanceRouter.get('/balance', authValidation, getBalance);
balanceRouter.post('/new-entry', authValidation, validateSchema(entriesSchema), newEntry);

export default balanceRouter;