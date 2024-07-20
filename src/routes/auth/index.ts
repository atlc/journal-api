import express from "express";
import db from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseUser, Payload } from "../../types";
import config from "../../config";
import accessTokenCheck from "../../middlewares/tokenCheck";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || typeof email !== "string" || email.length < 6 || email.length > 128) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (!password || typeof password !== "string" || password.length < 12 || password.length > 128) {
            return res.status(400).json({ message: "Invalid password - must be between 12 and 128 characters" });
        }

        const user = await db.users.find(email);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return res.status(401).json({ message: "Invalid credentials" });

        const payload: Payload = { id: user._id };

        const access_token = jwt.sign(payload, config.jwt.access_key, { expiresIn: config.jwt.access_expiration });
        const refresh_token = jwt.sign(payload, config.jwt.refresh_key, { expiresIn: config.jwt.refresh_expiration });

        await db.tokens.add({ user_id: user._id, token: refresh_token });

        res.status(200).json({ message: "Successfully logged in!", access_token, refresh_token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot login at this time" });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || typeof name !== "string" || name.length < 2 || name.length > 128) {
            return res.status(400).json({ message: "Invalid name - must be between 2 and 128 characters" });
        }

        if (!email || typeof email !== "string" || email.length < 6 || email.length > 128) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (!password || typeof password !== "string" || password.length < 12 || password.length > 128) {
            return res.status(400).json({ message: "Invalid password - must be between 12 and 128 characters" });
        }

        const created_at = new Date().toISOString();
        const is_verified = false;
        const hashed = await bcrypt.hash(password, 12);

        const newUser: BaseUser = { name, email, password: hashed, created_at, is_verified };

        const results = await db.users.register(newUser);
        const id = results.insertedId as unknown as string;

        const payload: Payload = { id };

        const access_token = jwt.sign(payload, config.jwt.access_key, { expiresIn: config.jwt.access_expiration });
        const refresh_token = jwt.sign(payload, config.jwt.refresh_key, { expiresIn: config.jwt.refresh_expiration });

        res.status(201).json({ message: "Successfully registered!", id: results.insertedId, access_token, refresh_token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot login at this time" });
    }
});

router.post("/reload", async (req, res) => {
    const { refresh_token } = req.body;

    try {
        const tokenPair = await db.tokens.get(refresh_token);

        if (!tokenPair) return res.status(403).json({ message: "Unable to refresh your credentials, please log in again" });

        const payload = jwt.verify(tokenPair.token, config.jwt.refresh_key) as Payload;

        const access_token = jwt.sign(payload, config.jwt.access_key, { expiresIn: config.jwt.access_expiration });

        res.json({ access_token, refresh_token });
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Cannot refresh tokens at this time, please try manually logging in" });
    }
});

router.get("/validate", accessTokenCheck, (req, res) => res.status(200).json({ message: "Token's good" }));

export default router;
