import db from "../config/database.js";

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if(!token) return res.status(401).send("Informe o token");

    try {
        const checkSession = await db.collection('sessions').findOne({ token });

        if(!checkSession) return res.status(401).send("Informe um token válido");
        
        res.locals.session = checkSession;

        next();
    } catch (err) {
        return res.status(500).send(err.message);
    }
}