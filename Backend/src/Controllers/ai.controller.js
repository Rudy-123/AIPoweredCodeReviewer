const { generateContent } = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(400).send("Prompt is required");
    }

    const response = await generateContent(code);
    res.send(response);
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).send("AI service failed");
  }
};
