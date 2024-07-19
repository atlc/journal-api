import express from "express";
import journalRouter from "./journals";
import tokenCheck from "../../middlewares/tokenCheck";

const router = express.Router();

router.get("/health", (req, res) => res.json({ message: "Server is live and responding" }));
router.use("/journals", tokenCheck, journalRouter);

export default router;
