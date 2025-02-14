const { data } = require("autoprefixer");
const axios = require("axios");
const cheerio = require("cheerio");

async function getTextFromURL(url) {
  try {
    // Fetch the HTML content of the URL
    const { data: html } = await axios.get(url);
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    const translation = $('#meanTools').prev().get(0).nextSibling.nodeValue.trim();

    meaning = translation.replace(": ","").split("،").slice(0,3).join("، ")

    
   
    return meaning;
  } catch (error) {
    console.error("Error fetching or parsing the URL:", error); 
    return null;
  }
}

// Export the function
module.exports = { getTextFromURL };
