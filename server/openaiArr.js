const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateResponseArray(words) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `make a JSON Array of objects with this list of words ${words} including each word's precise and brief Persian meaning, its standard US International Phonetic Alphabet (IPA) and an example sentence using this pattern: [{ "word":  \"\" , "meaning" : \"\" ,  "pronunciation" : \"\", "example" : \"\" }]`,
        },
      ],
      temperature: 1,
      max_tokens: 512,
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
  generateResponseArray,
};
