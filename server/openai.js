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
          content: `Generate a JSON object for singular form of "${word}" with its short Persian(Farsi) meaning, US IPA, and an example sentence. Follow: { "word": "${word}", "meaning": "", "pronunciation": "", "example": "" }`,
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
