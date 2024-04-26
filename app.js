import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import housingRoutes from "./routes/housingRoute.js";
import connection from "./config/db.js";
import applicationRouter from "./routes/applicationRoute.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const PORT = process.env.PORT || 3000;
connection.once("open", () => {
  app.listen(3000, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/housing", housingRoutes);
app.use("/application", applicationRouter);
app.use("/", indexRouter);

app.use((err, _req, res, _next) => {
  res.status(err.code);
  res.send({ message: err.message });
});


export default app;
