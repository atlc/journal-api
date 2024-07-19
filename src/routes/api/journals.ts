import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot retrieve your journals at this time" });
    }
});

router.post("/", async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Cannot create journals at this time" });
    }
});

export default router;
