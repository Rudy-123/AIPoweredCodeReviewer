const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const output = await aiService.getReviewFromAI(code, language);
    res.json({ output });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI service failed" });
  }
};
