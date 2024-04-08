const express = require("express");
const router = express.Router();
const courseApi = require("./apiroutes/courseapi");

router.use("/course", courseApi);

router.get("/", (req, res) => {
  res.send("in api route");
});

module.exports = router;
