const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Scrape reddit function
async function scrapeReddit(subreddit) {

    // Get the top posts of the day
    const response = await axios.get('https://reddit.com/r/' + subreddit + "/top/?t=day")

    // Load the html with Cheerio
    const $ = cheerio.load(response.data);
    
    // Grab the posts on the HTML page using the class '.Post'
    const posts = $('.Post')

    const memeUrls = [];

    // Iterate trough each post and save the Image URL and Title to the memeUrls dataset
    posts.each((index, element) => {
        if (index < 10) {
            const title = $(element).find('.SQnoC3ObvgnGjWt90zD9Z').text();
            const imageUrl = $(element).find('.ImageBox-image').attr('src');
            memeUrls.push({ title, imageUrl });
        }
    });

    
}

scrapeReddit("memes")