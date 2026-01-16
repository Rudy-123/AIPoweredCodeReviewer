const express = require("express");
const aicontroller = require("../Controllers/ai.controller");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hii ho gaya kaam");
});
//.get was to check whether AI is giving responses or not
router.post("/get-review", aicontroller.getReview);
module.exports = router;
