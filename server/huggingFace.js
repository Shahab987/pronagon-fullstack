const axios = require("axios");

// Your Hugging Face API token
const apiKey = process.env.HF_API_KEY;

async function huggingfaceApi(prompt) {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const data = {
    inputs: "Translate 'say hello' to Farsi",
  };

  try {
    // Test with a known model like 'gpt2'
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google-t5/t5-small",  // Test with a known model
      data,
      { headers }
    );
    return response.data; // Return the result to the caller
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw new Error("Failed to get response from Hugging Face API");
  }
}

module.exports = {
  huggingfaceApi,
};
