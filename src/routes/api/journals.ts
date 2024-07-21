import express from "express";
import db from "../../db";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const user_id = req.user.id;
        const userJournals = await db.journals.profile(user_id);

        res.json(userJournals);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot retrieve your journals at this time" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || typeof content !== "string" || content.length < 12 || content.length > 10000) {
            return res.status(400).json({ message: "The journal's content must be between 12 and 10,000 characters" });
        }

        const user_id = req.user.id;
        const created_at = new Date().toISOString();

        const results = await db.journals.create({ content, user_id, created_at });

        res.status(201).json({ message: "Successfully created journal entry", id: results.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot create journals at this time" });
    }
});

export default router;
