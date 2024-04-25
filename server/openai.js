const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateResponse(word) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a JSON object for the singular form of "${word}" including its short Persian (Farsi) meanings, US IPA pronunciation, and an example sentence. Please follow this format:

          {
            "word": "${word}",
            "meaning": "Meaning in Persian",
            "pronunciation": "US IPA Pronunciation",
            "example": "Example sentence in English with ${word}"
          }`,
        },
      ],
      temperature: 0.5,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    return parsedData;
  } catch (error) {
    console.error("Error generating response from OpenAI:", error);
    return false;
  }
}

module.exports = {
  generateResponse,
};
