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
import applicationRoutes from "./routes/applicationRoute.js";
import optRequestRoutes from "./routes/optRequestRoute.js";
import hiringRoutes from "./routes/hiringRoute.js";
import cors from "cors";

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

//added cors to allow cross origin requests
app.use(
  cors({
    origin: "http://localhost:5173",
    origin: "http://localhost:4200",
  })
);

// // for testing retrieveImageUrl
// import { retrieveImageUrl } from "./middlewares/AWSMiddleware.js";
// app.get("/api/posts", retrieveImageUrl);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/housing", housingRoutes);
app.use("/application", applicationRoutes);
app.use("/visa", optRequestRoutes);
app.use("/hiring", hiringRoutes);
app.use("/", indexRouter);

app.use((err, _req, res, _next) => {
  res.status(err.code);
  res.send({ message: err.message });
});

export default app;
