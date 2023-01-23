import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./router/AuthRoutes.js";
import balanceRouter from "./router/BalanceRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use([ authRouter, balanceRouter ]);

app.listen(process.env.PORT, () => {
    console.log("Connected to database...");
});