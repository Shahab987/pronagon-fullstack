// routes/playwrightRoutes.js
const express = require('express');
const { chromium } = require('playwright');

const router = express.Router();

// Scraping route

router.get('/scrape', async (req, res) => {
    let browser;
    let page;
    let retries = 3; // Set the number of retries

    try {
        console.log("scraping...");

        browser = await chromium.launch({ headless: false });
        page = await browser.newPage();
        const url = 'https://api.dynamic.reports.employment.gov.au/anonap/extensions/hSKLS02_SkillSelect_EOI_Data/hSKLS02_SkillSelect_EOI_Data.html';

        // Function to attempt page load with retry on timeout
        const loadPageWithRetry = async (url, retries) => {
            let attempt = 0;
            while (attempt < retries) {
                try {
                    console.log(`Attempting to load page, attempt #${attempt + 1}`);
                    await page.goto(url, {
                        waitUntil: 'networkidle',
                        timeout: 40000 // Timeout after 60 seconds
                    });
                    console.log('Page loaded successfully');
                    return; // If successful, return from the function
                } catch (error) {
                    if (error.name === 'TimeoutError') {
                        console.log(`Timeout exceeded, retrying...`);
                        await page.reload(); // Refresh the page
                        attempt++; // Increment the attempt count
                    } else {
                        throw error; // If another error occurs, throw it
                    }
                }
            }
            throw new Error('Failed to load the page after multiple retries');
        };

        // Attempt to load the page with retries
        await loadPageWithRetry(url, retries);

 //------------------------------------------------------------------------------------------

         // Now click on the "NEXT" button
        try {
            // Wait for the "NEXT" button to be visible and click it
            await page.waitForSelector('[data-qcmd="navNext"]');

        // Click the Next button using the data-qcmd attribute
        await page.click('[data-qcmd="navNext"]');
        console.log("Clicked on the Next button!");

        
        } catch (error) {
            console.error('Error clicking the NEXT button:', error.message);
            res.status(500).json({ success: false, error: 'Failed to click NEXT button' });
            return;
        }
 //------------------------------------------------------------------------------------------
        await page.waitForSelector('.lui-button[data-value]'); 

        // Select all buttons with 'data-value' attribute
        const buttons = await page.$$('.lui-button[data-value]');

        // Filter buttons to only include those with data-value="Y"
        const filteredButtons = [];
        for (const button of buttons) {
            const value = await button.getAttribute('data-value');
            if (value === 'Y') {
                filteredButtons.push(button);
            }
        }

        // Click the first two buttons with data-value="Y"
        if (filteredButtons.length > 1) {
            await filteredButtons[0].click(); // Click the first button
            console.log('Clicked the first button with data-value="Y"!');
            
           // await filteredButtons[1].click(); // Click the second button
            //console.log('Clicked the second button with data-value="Y"!');
        }
 //------------------------------------------------------------------------------------------

        
        // Extract content after successful page load
        const data = await page.evaluate(() => document.body.innerText);
        console.log(data); // Log the content

        //await browser.close();
        
        res.json({ success: true, data }); // Send the extracted content
    } catch (error) {
       // if (browser) await browser.close();
        console.error("Error during scraping:", error); // Log the error
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
