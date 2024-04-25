import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import { fileURLToPath } from "url";
import userRoutes from './routes/userRoute.js';
import authRoutes from './routes/authRoute.js';
import housingRoutes from './routes/housingRoute.js';
import connection from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || 3000;
connection.once('open', () => {
    app.listen(3000, () => console.log(`Server is running on http://localhost:${PORT}`));
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/housing', housingRoutes);
app.use("/", indexRouter);

export default app;
