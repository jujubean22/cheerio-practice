const PORT = 8000
const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");

const app = express();
const url = "https://www.rappler.com/latest/";

axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    let rapplerLatest = [];
    const length = $(".archive-article__content", html).children('h2').prev()

    // console.log(`Aritcles are ${length} long`);

    $(".archive-article__content", html).each((i, el) => {
      const category = $(el)
        .find('.archive-article__eyebrow')
        .text()
        .replace(/\s\s+/g, ''); // look for regex explanation in this file (ctrl + f) 
      const title = $(el)
        .find('h2')
        .text()
        .replace(/\s\s+/g, ''); // look for regex explanation in this file (ctrl + f) 
      const link = $(el)
        .find('a')
        .attr('href')
      
      rapplerLatest.push({
        category,
        title,
        link
      });
    });

    app.get('/', function (req, res) {
      res.send(rapplerLatest)
    })
    console.log(rapplerLatest);
  })
  .catch((err) => console.log(err));


app.listen(PORT, () => console.log(`"server running in port ${PORT}`));

/*
####### REGEX EXPLANATION FOR TITLE IN RAPPLER Array #######
/\s\s+/g
\s matches any whitespace character (equivalent to [\r\n\t\f\v ])
\s matches any whitespace character (equivalent to [\r\n\t\f\v ])
+ matches the previous token between one and unlimited times, as many times as possible, giving back as needed (greedy)
Global pattern flags 
g modifier: global. All matches (don't return after first match)
SOURCE: regex101
*/

//#maincontent > div > div.l-plp > div.l-plp-container.women-clothing-tops > div.l-plp-content > div.l-plp-products_container > div.b-products_grid.js-products_grid