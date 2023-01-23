import db from "../config/database.js";
import dayjs from "dayjs";

export async function getBalance(req, res) {
    const checkSession = res.locals.session;

    try {
        const balance = await db.collection('balance').find({ idUser: checkSession.idUser }).toArray();

        return res.status(200).send(balance);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function newEntry(req, res) {
    const { amount, description, isTrue } = req.body;
    const checkSession = res.locals.session;

    try {
        await db.collection('balance').insertOne({ day: dayjs().format('DD/MM'), amount, description, isTrue, idUser: checkSession.idUser });

        return res.status(200).send("Entrada lançada com sucesso");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}