import db from "../config/database.js";

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
    const { value, description, type } = req.body;
    const checkSession = res.locals.session;

    try {
        await db.collection('balance').insertOne({ value, description, type, idUser: checkSession.idUser });

        return res.status(200).send("Entrada lançada com sucesso");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}