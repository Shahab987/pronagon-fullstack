// openai.js
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
          content: `make a JSON string object with word ""${word} including its meaning in Persian(Farsi), its standard US phonetic and an example sentence. use this pattern: { "word":  \"\" , "meaning" : \"\" ,  "pronunciation" : \"\", "example" : \"\" }`,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response;
  } catch (error) {
    console.error("Error generating response from OpenAI:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
