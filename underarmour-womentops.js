const PORT = 3008
const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const app = express();
let pages = []
let newArr = []

function getPageNumber() {
  for (let i = 0; i <= 300; i +=12) {
    pages.push(i);
  } 
}

function getAllProducts() {
  for (let i = 0; i < pages.length; i++) {
    underArmour(pages[i])
  }
}

async function underArmour(p=12) {
  try {
    let UAtops =  []
    const site = `https://www.underarmour.com.sg/en-sg/c/womens/clothing/tops/?start=${p}`
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
      const image = `${$(el).find('a > picture > img').attr('data-src')}`
      // console.log(image);
      UAtops.push({
        price,
        name,
        link,
        image
      });
    })
    newArr.push(UAtops);
    console.log(newArr.flat().length);
    return newArr;
  } catch (error) {
    
  }
}

getPageNumber()
getAllProducts()
underArmour() 

app.get('/',  (req, res) => {
  try {
    const UAtopsAll =  newArr.flat()

    return res.status(200).json({
      UAwomen_tops: UAtopsAll
    })
    
  } catch (error) {
    return res.status(500).json({
      err: err.toString()
    })
    
  }
})

app.listen(PORT, () => console.log(`Server running in port ${PORT}`));