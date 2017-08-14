const router = require('express').Router()
const axios = require('axios')
const sanitizeHtml = require('sanitize-html')
const html2json = require('html2json').html2json;
module.exports = router

router.use('/recipe-sources', require('./recipe-sources'))

function getJsonFromUrl(source_url, picture_url){
  return axios.get(source_url)
  .then(apiRes => {
    const rawHtml = apiRes.data;
    const sanitizedHtml = sanitizeHtml(rawHtml, {
      allowedTags: ['title', 'img', 'ul', 'ol', 'li'],
      allowedAttributes: {
        'img': ['src', 'data-src']
      }
    }).replace(/\n/g, ' ').replace(/\r |\t/g, '').replace(/ +/g, ' ').replace(/&amp;/g, '&');
    
    function findTitle(html){
      const idx1 = html.indexOf('<title>');
      const idx2 = html.indexOf('</title>');
      return html.slice(idx1 + 7, idx2);
    }

    // find image if not provided by the API response
    function findImage(html){
      const idx1 = html.indexOf('<img');
      const imgString = html.slice(idx1);
      const idx2 = imgString.indexOf('/>')
      const imgUrl = html2json(imgString.slice(0, idx2 + 2)).child[0].attr.src;
      return imgUrl;
    }

    // find the first index where the first tag after 'listName' keyword is an ordered or unordered list
    function findList(html, listName){
      for (let i = 0; i < sanitizedHtml.length; i++){
        let substring = sanitizedHtml.slice(i);
        if (substring.startsWith(listName)){
          for (let j = 0; j < substring.length; j++){
            if (substring[j] === '<') {
              if (substring[j+1] === 'o' || substring[j+1] === 'u') return i;
              else break;
            }
          }
        }
      }
    }
    
    // NEED TO CREATE LOGIC TO CONTROL FOR CONSECUTIVE LISTS WITHIN A SECTION (e.g. allrecipes.co.uk)
    
    // trim html string to only the specified section (e.g. Ingredients, Preparation, etc.)
    function clipSection(html, section){
      if (!findList(html, section)) return;
      let clip = html.slice(findList(html, section));
      
      // find whether ol or ul is used in the DOM
      let closeList = clip.indexOf('<ol>') < clip.indexOf('<ul>') ? '</ol>' : '</ul>'
      
      let idx2 = clip.indexOf(closeList);
      clip = clip.slice(0, idx2);
      return clip;
    };
    
    // convert ingredients and directions sections to array
    function createArray(section){
      const list = section.child.find(el => el.tag === 'ul' || el.tag === 'ol');
      const elements = list.child.reduce((acc, el) => {
        if (el.child) {
          return acc.concat(el.child[0].text);
        }
        else return acc;
      }, [])
      return elements;
    }

    // GET TITLE AND PICTURE URL
    const title = findTitle(sanitizedHtml);

    // Not needed for NY TIMES response - uncomment where necessary
    // const picture_url = findImage(sanitizedHtml);
    
    // GET INGREDIENTS
    let ingredients = html2json(clipSection(sanitizedHtml, 'Ingredients'));
    ingredients = createArray(ingredients);
    
    // run clipSection for the first instruction keyword that is followed by ordered or unordered list
    const directionsKeywords = ['Preparation', 'Instructions', 'Method', 'Directions'];
    let directions = html2json(clipSection(sanitizedHtml, directionsKeywords.find(el => !!findList(sanitizedHtml, el))));
    directions = createArray(directions);
    
    
    const obj = {
      title,
      source_url,
      picture_url,
      ingredients,
      directions
    }
    
    return obj;
  })
}

// router.get('/food2fork', (req, res, next) => {
//   console.log('food 2 fork key', process.env.FOOD2FORK_KEY);
//   axios.get(`http://food2fork.com/api/search?key=${process.env.FOOD2FORK_KEY}&page=1`)
//   .then(apiRes => {
//     const { recipes } = apiRes.data;
//     const recipeUrls = recipes.map(recipe => recipe.source_url);

//     const promises = [];
//     recipeUrls.forEach(url => {
//       let promise = getJsonFromUrl(url);
//       promises.push(promise)
//     })

//     Promise.all(promises)
//     .then(data => {
//       res.send(data);
//     })
//   })
// })

router.get('/nytimes', (req, res, next) => {
  axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.NYT_KEY}&query=recipe`)
  .then(apiRes => {
    // res.send(apiRes.data);
    const recipes = apiRes.data.response.docs;

    const promises = [];
    recipes.forEach(recipe => {
      let promise = getJsonFromUrl(recipe.web_url, 'https://nytimes.com/' + recipe.multimedia[1].url);
      promises.push(promise)
    })

    Promise.all(promises)
    .then(data => {
      res.send(data);
    })
  })
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
