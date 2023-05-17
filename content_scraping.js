const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Scrape reddit function
async function scrapeReddit(subreddit) {
    try {
        // Get the top posts of the day
        const response = await axios.get('https://reddit.com/r/' + subreddit + "/top/?t=day");

        // Load the html with Cheerio
        const $ = cheerio.load(response.data);
    
        // Grab the posts on the HTML page using the class '.Post'
        const posts = $('.Post');

        const memeUrls = [];

        // Iterate trough each post and save the Image URL and Title to the memeUrls dataset
        posts.each((index, element) => {
            if (index < 10) {
                const title = $(element).find('.SQnoC3ObvgnGjWt90zD9Z').text();
                const imageUrl = $(element).find('.ImageBox-image').attr('src');

                // Some memes are video's and has a different html class so it can't find the .ImageBox-image and it ends up undefined, so I skip over those
                if (imageUrl != undefined) {
                    memeUrls.push({ title, imageUrl });
                }

            }
        });

        // Download and save the memes
        memeUrls.forEach((meme, index) => {
            const { title, imageUrl } = meme;

            axios({url: imageUrl,responseType: 'stream',}).then(response => {
                const filePath = `meme${index + 1}.jpg`;
                response.data.pipe(fs.createWriteStream(filePath));
                console.log(`Meme ${index + 1} saved: ${filePath}`);
            });
        })} catch (error) {
        console.error('Error:', error);
    }
}


scrapeReddit("memes")