import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("<h1>Employee portal backend</h1>");
});

export default router;
