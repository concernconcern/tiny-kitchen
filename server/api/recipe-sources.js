const router = require('express').Router()
const axios = require('axios')
const sanitizeHtml = require('sanitize-html')
const html2json = require('html2json').html2json;
module.exports = router

router.use('/recipe-sources', require('./recipe-sources'))

router.get('/', (req, res, next) => {
  axios.get('http://www.seriouseats.com/recipes/2017/08/blackberry-cake-recipe.html')
  .then(apiRes => {
    const rawHtml = apiRes.data;
    const sanitizedHtml = sanitizeHtml(rawHtml, {
      allowedTags: [ 'ul', 'ol', 'li'],
      allowedAttributes: []
    }).replace(/\n/g, ' ').replace(/ +/g, ' ').replace(/\r |\t/g, '').replace(/&amp;/g, '&');
    
    // find the first index where the first tag after 'list' keyword is an ordered or unordered list
    function findList(html, list){
      for (let i = 0; i < sanitizedHtml.length; i++){
        let substring = sanitizedHtml.slice(i);
        if (substring.startsWith(list)){
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
    
    function clipSection(html, section){
      if (!findList(html, section)) return;
      let clip = html.slice(findList(html, section));
      
      // find whether ol or ul is used in the DOM
      let closeList = clip.indexOf('<ol>') < clip.indexOf('<ul>') ? '</ol>' : '</ul>'
      
      let idx2 = clip.indexOf(closeList);
      clip = clip.slice(0, idx2);
      return clip;
    };
    
    const instructionsKeywords = ['Preparation', 'Instructions', 'Method', 'Directions'];
    
    // run clipSection for first instruction keyword that is followed by ordered or unordered list
    const instructions = html2json(clipSection(sanitizedHtml, instructionsKeywords.find(el => !!findList(sanitizedHtml, el))));
    const ingredients = html2json(clipSection(sanitizedHtml, 'Ingredients'));
    
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
    
    const obj = {
      title: '',
      picture: '',
      ingredients: createArray(ingredients),
      directions: createArray(instructions)
    }
    
    res.json(obj);
  })
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})