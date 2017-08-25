const sanitizeHtml = require('sanitize-html')
const html2json = require('html2json').html2json;
const axios = require('axios');

module.exports = function getJsonFromUrl(source_url, picture_url) {
  return axios.get(source_url)
    .then(apiRes => {
      const rawHtml = apiRes.data;
      
      // handle non-html responses
      if (typeof rawHtml !== 'string') return {};

      let sanitizedHtml = sanitizeHtml(rawHtml, {
        allowedTags: ['title', 'img', 'ul', 'ol', 'li'],
        allowedAttributes: {
          'img': ['src', 'data-src']
        }
      }).replace(/\n/g, ' ').replace(/\r |\t/g, '').replace(/ +/g, ' ').replace(/&amp;/g, '&');

      // custom replacements for AllRecipes.com
      sanitizedHtml = sanitizedHtml.replace(/Serving size has been adjusted!(.*?)\(uses your location\)/g, '').replace(/{{model.addEditText}}(.*?)<\/ul>/g, '').replace(/ADVERTISEMENT/g, '').replace(/<li> Add all ingredients to list <\/li>/g, '').replace(/ +/g, ' ');
      
      function findTitle(html) {
        const idx1 = html.indexOf('<title>');
        const idx2 = html.indexOf('</title>');
        return html.slice(idx1 + 7, idx2).split(' - ')[0].split('|')[0];
      }

      // find image if not provided by an API response
      function findImage(html) {
        const idx1 = html.indexOf('<img');
        const imgString = html.slice(idx1);
        const idx2 = imgString.indexOf('/>')
        const imgUrl = html2json(imgString.slice(0, idx2 + 2)).child[0].attr.src;
        return imgUrl;
      }

      function findImages(html) {
        let imgUrls = [];
        while (html.includes('<img')){
          const idx1 = html.indexOf('<img');
          const imgString = html.slice(idx1);
          const idx2 = imgString.indexOf('/>')
          const imgJson = html2json(imgString.slice(0, idx2 + 2))
          if (imgJson.child[0].attr) {
            const imgSrc = imgJson.child[0].attr.src;
            const imgDataSrc = imgJson.child[0].attr['data-src'];
            imgUrls = imgUrls.concat(imgSrc, imgDataSrc);
          }
          html = html.slice(idx2);
        }
        return imgUrls.filter(el => !!el).filter(el => !!el.startsWith('http')).filter((el, idx, arr) => arr.indexOf(el) === idx);
      }

      // find the first index where the first HTML tag after 'listName' keyword is an ordered or unordered list
      function findList(html, listName) {
        for (let i = 0; i < sanitizedHtml.length; i++) {
          let substring = sanitizedHtml.slice(i);
          if (substring.startsWith(listName)) {
            for (let j = 0; j < substring.length; j++) {
              if (substring[j] === '<') {
                if (substring[j + 1] === 'o' || substring[j + 1] === 'u') return i;
                else break;
              }
            }
          }
        }
      }

      // find whether a list section is immediately followed by the same list (e.g. allrecipes.co.uk)
      function listContinuation(html, closeList){
        for (let i = 0; i < html.length; i++){
          let substring = html.slice(i);
          if (substring.startsWith('<')){
            if (substring[1] === closeList[2]) return true;
            else return false;
          }
        }
      }

      // trim html string to only the specified 'section' (e.g. Ingredients, Preparation, etc.)
      function clipSection(html, section) {
        if (findList(html, section) === undefined) return;
        let clip = html.slice(findList(html, section));

        // find whether ol or ul is used in the DOM
        let closeList = clip.indexOf('<ol>') < clip.indexOf('<ul>') && clip.indexOf('<ol>') !== -1 ? '</ol>' : '</ul>'

        let idx2 = clip.indexOf(closeList);
        while (listContinuation(clip.slice(idx2 + 5), closeList)) {
          idx2 = clip.indexOf(closeList, idx2+1)
        }
        clip = clip.slice(0, idx2);
        return clip;
      };

      // convert ingredients and directions sections to array
      function createArray(section) {
        const lists = section.child.filter(el => el.tag === 'ul' || el.tag === 'ol');
        const elements = lists.reduce((acc, list) => {
          return acc.concat(list.child.reduce((acc, el) => {
            if (el.child) return acc.concat(el.child[0].text);
            else return acc;
          }, []))
        }, [])
        return elements.filter(el => el !== ' ').filter(el => !el.includes('Nutritional Information'));
      }

      // GET TITLE AND PICTURE URL
      const title = findTitle(sanitizedHtml);

      // Not needed for NY TIMES response
      if (!picture_url) picture_url = findImages(sanitizedHtml);

      // GET INGREDIENTS
      const ingredientsKeywords = ['Ingredients', "What You'll Need"]
      let ingredientKeyword = ingredientsKeywords.find(el => !!findList(sanitizedHtml, el));
      let ingredients = clipSection(sanitizedHtml, ingredientKeyword);
      if (ingredients) {
        ingredients = html2json(ingredients);
        ingredients = createArray(ingredients);
      }

      // slice the html string to begin where ingredients list ends before moving on to directions
      sanitizedHtml = sanitizedHtml.slice(findList(sanitizedHtml, ingredientKeyword) + clipSection(sanitizedHtml, ingredientKeyword).length + 5)

      // run clipSection for the first instruction keyword that is followed by ordered or unordered list
      const directionsKeywords = ['Preparation', 'Instructions', 'Method', 'Directions', 'How to Make It'];

      let directions = clipSection(sanitizedHtml, directionsKeywords.find(el => findList(sanitizedHtml, el) !== undefined));
      if (directions) {
        directions = html2json(directions);
        directions = createArray(directions);
      } else {
        let sanitizedHtmlAlt = sanitizeHtml(rawHtml, {
          allowedTags: ['div', 'p', 'br'],
          allowedAttributes: []
        }).replace(/\n/g, ' ').replace(/\r |\t/g, '').replace(/ +/g, ' ').replace(/&amp;/g, '&').replace(/<div><\/div>/g, '');
      
        let directionsKeyword = directionsKeywords.find(el => findDirectionsAlt(sanitizedHtmlAlt, el) !== undefined)
        directions = findDirectionsAlt(sanitizedHtmlAlt, directionsKeyword);
      }

      function findDirectionsAlt(html, section){
        let clippedText = clipText(html, section);        
        function clipText(html, section){
          let idx = html.indexOf(section);
          if (idx === -1) return;
          return html.slice(idx);
        }
        if (!clippedText) {
          return;
        }

        let list = startList(clippedText)
        function startList(html, resultObj={}){
          for (let i = 0; i < html.length; i++){
            let substring = html.slice(i);
            if (substring.startsWith('<')){
              if (substring[1] === '/') continue;
              resultObj.start = i;
              resultObj.listType = substring.slice(1,3);
              return resultObj
            }
          }
        }

        list = endList(clippedText, list)
        function endList(html, resultObj){
          let openEls = 1;
          for (let i = resultObj.start; i < html.length; i++){
            substring = html.slice(i);
            if (substring.startsWith(`<${resultObj.listType}`)) openEls++;
            if (substring.startsWith(`</${resultObj.listType}`)){
              if (openEls === 1){
                resultObj.end = i;
                resultObj.text = html.slice(resultObj.start, resultObj.end + 6);
                return resultObj;
              } else {
                openEls--;
              }
            }
          }
        }

        function filterList(el){
          return el !== 'div' &&
          el !== '/div' &&
          el !== 'p' &&
          el !== '/p' &&
          el !== 'br/' &&
          el !== 'br /' &&
          el !== 'br' &&
          el !== '' &&
          el !== ' ';
        }

        function filterSteps(el){
          let includesStep = el.slice(0, 5).includes('Step') || el.slice(0, 5).includes('step')
          return !(includesStep && el.length < 9);
        }

        function mapList(el){
          if (el.slice(el.length-2) === ' t') el = el.slice(0, el.length-2);
          if (el[el.length-1] === ' ') el = el.slice(0, el.length-1);
          if (el[0] === ' ') el = el.slice(1);
          return el;
        }

        list.text = list.text.split(/<(.*?)>/).filter(filterList).filter(filterSteps).map(mapList);

        return list.text;
      }

      const obj = {
        title,
        source_url,
        picture_url,
        ingredients,
        directions
      }

      return obj;
    })
    .catch(err => {
      return {};
    })
}