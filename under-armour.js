const PORT = 3030
const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const { addClass } = require("cheerio/lib/api/attributes");

const app = express();

async function underArmour () {
  try {
    let UAtops = []
    const site = "https://www.underarmour.com.sg/en-sg/c/womens/clothing/tops/"
    const baseUrl ="https://www.underarmour.com.sg"

    const { data } = await axios ({
      method: 'GET',
      url: site
    })
    $ = cheerio.load(data)
    topSelector = '#maincontent > div > div.l-plp > div.l-plp-container.women-clothing-tops > div.l-plp-content > div.l-plp-products_container > div.b-products_grid.js-products_grid > section.b-products_grid-tile'

    $(topSelector).each((i, el) => {
      const link = `${baseUrl}${$(el).find('a').attr('href')}`
      const name = $(el).find('.b-tile-name').text()
      const price = $(el).find(".b-price").text().replace(/(\n|\n)/g, "")
      UAtops.push({
        price,
        name,
        link
      });
      
    })
  return UAtops;
  } catch (error) {
    
  }
}

underArmour()



app.get('/', async(req, res) => {
  try {
    const UAtops = await underArmour()

    return res.status(200).json({
      result: UAtops
    })
    
  } catch (error) {
    return res.status(500).json({
      err: err.toString()
    })
    
  }
})

app.listen(PORT, () => console.log(`Server running in port ${PORT}`));