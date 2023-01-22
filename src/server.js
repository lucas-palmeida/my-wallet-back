import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try {
    await mongoClient.connect();
} catch (err) {
    console.log(err.message);
}

const db = mongoClient.db();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/sign-up', async (req, res) => {
    const user = req.body;

    const signUpSchema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });

    try {
        const validation = signUpSchema.validate(user, { abortEarly: false });

        if(validation.error) return res.status(422).send("Verifique se os campos foram preenchidos corretamente");

        const passwordHashed = bcrypt.hashSync(user.password, 10);

        await db.collection('users').insertOne({ name: user.name, email: user.email, password: passwordHashed, confirmPassword: passwordHashed });

        return res.status(200).send("Usuário cadastrado com sucesso!");
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

app.post('/sign-in', async (req, res) => {
    const user = req.body;

    const signInSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })

    try {
        const validation = signInSchema.validate(user, { abortEarlyAccess: false });

        if(validation.error) return res.status(422).send("Verifique se os campos foram preenchidos corretamente.");

        const checkUser = await db.collection('users').findOne({ email: user.email });

        if(!checkUser) return res.status(400).send("Verifique o email e/ou senha informados.");

        const checkPassword = bcrypt.compareSync(user.password, checkUser.password);

        if(!checkPassword) return res.status(400).send("Verifique o email e/ou senha informados.");

        const token = uuidv4();

        await db.collection('sessions').insertOne({ idUser: checkUser._id, token });

        return res.status(200).send(token);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Connected to Mongo");
});