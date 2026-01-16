const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    // Call your AI service
    const output = await aiService.generateContent(code, language);

    // Send output in correct format for frontend
    return res.json({ output });
  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI service failed" });
  }
};
