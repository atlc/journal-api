import express from "express";
import { applyMiddlewaresTo } from "./middlewares/express";

const app = express();
applyMiddlewaresTo(app);

const PORT = process.env.PORT || 3000;

app.get("/api/health", (req, res) => res.json({ message: "Server is live and responding" }));

app.listen(PORT, () => console.log(`Server launched at ${new Date().toLocaleString()} on port ${PORT}`));
