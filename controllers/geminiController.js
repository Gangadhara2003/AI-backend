const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatHistory = [];
    for (const item of history) {
      chatHistory.push({
        role: "user",
        parts: [{ text: item.prompt }],
      });
      chatHistory.push({
        role: "model",
        parts: [{ text: item.response }],
      });
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(prompt);
    console.log("Gemini API result:", result);
    const response = await result.response;
    console.log("Gemini API response object:", response);
    const responseText = response.text();

    if (!responseText) {
      console.error('Gemini API returned an empty or invalid response.', response);
      return res.status(500).json({ message: 'Gemini API returned an empty or invalid response.' });
    }

    res.json({ text: responseText });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { generateContent };
