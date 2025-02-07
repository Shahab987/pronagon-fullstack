const OpenAI = require("openai");

const apiKey = process.env.DEEPSEEKAPI;


const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey
});

async function deepSeek(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "deepseek-chat",
  });

  console.log("resssssssssss:",completion.choices[0].message.content);
  return completion.choices[0].message.content
}

module.exports = {
    deepSeek,
};
  