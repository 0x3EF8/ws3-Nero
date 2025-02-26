/**
 * Command: genai
 * ---------------
 * Description: Generate content using Google Generative AI based on your prompt.
 * Usage: genai <prompt>
 *
 * Example:
 *   genai Explain how AI works.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

module.exports = {
  name: 'genai',
  description:
    'Generate content using Google Generative AI based on your prompt.',
  category: 'user',
  usage: 'genai <prompt>',
  run: async function (api, event, args) {
    if (!args || args.length === 0) {
      return api.sendMessage(
        'Please provide a prompt for the AI.',
        event.threadID,
      );
    }
    const prompt = args.join(' ');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return api.sendMessage(
        'Google API key is not configured.',
        event.threadID,
      );
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return api.sendMessage(responseText, event.threadID);
    } catch (err) {
      console.error('Error generating AI content:', err);
      return api.sendMessage('Error generating AI content.', event.threadID);
    }
  },
};
