import express from "express";
import { applyMiddlewaresTo } from "./middlewares/express";
import router from "./routes";

const app = express();
applyMiddlewaresTo(app);

app.use(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server launched at ${new Date().toLocaleString()} on port ${PORT}`));
