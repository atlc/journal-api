import express from "express";
import db from "../../db";
import { ObjectId } from "mongodb";
import { BaseEntry } from "../../types";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const user_id = req.user.id;
        const userJournals = await db.journals.profile(user_id);

        res.json(userJournals.reverse());
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot retrieve your journals at this time" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { content, is_note } = req.body;

        if (!content || typeof content !== "string" || content.length < 12 || content.length > 10000) {
            return res.status(400).json({ message: "The journal's content must be between 12 and 10,000 characters" });
        }

        if (typeof is_note !== "boolean") {
            return res.status(400).json({ message: "The journal's is_note field must be a boolean" });
        }

        const user_id = req.user.id;
        const created_at = new Date().toISOString();

        const newNote: BaseEntry = { content, is_note, user_id, created_at };

        const results = await db.journals.create(newNote);

        res.status(201).json({ message: "Successfully created journal entry", id: results.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot create journals at this time" });
    }
});

router.put("/:id/toggle", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { is_note } = req.query as { is_note: string };

        if (typeof is_note === "undefined" || typeof is_note !== "string" || (is_note.toLowerCase() !== "false" && is_note.toLowerCase() !== "true")) {
            return res.status(400).json({
                message: "'is_note' must be a provided query parameter of true or false",
            });
        }

        await db.journals.toggleNote(id, !!is_note);

        res.status(201).json({ message: "Successfully toggled note status" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot create journals at this time" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const user_id = req.user.id;

        await db.journals.remove(id, user_id);

        res.json({ message: "Successfully deleted that journal entry" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot retrieve your journals at this time" });
    }
});

export default router;
