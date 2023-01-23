import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import db from "../config/database.js";

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    try {
        const checkUser = await db.collection('users').findOne({ email });

        if(checkUser) return res.sendStatus(409);

        const passwordHashed = bcrypt.hashSync(password, 10);

        await db.collection('users').insertOne({ name, email, password: passwordHashed });

        return res.status(200).send("Usuário cadastrado com sucesso!");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const checkUser = await db.collection('users').findOne({ email });

        if(!checkUser) return res.status(400).send("Verifique o email e/ou senha informados.");

        const checkPassword = bcrypt.compareSync(password, checkUser.password);

        if(!checkPassword) return res.status(400).send("Verifique o email e/ou senha informados.");

        const token = uuidv4();

        await db.collection('sessions').insertOne({ idUser: checkUser._id, token });

        return res.status(200).send(token);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
