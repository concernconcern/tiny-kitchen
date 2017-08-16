const sanitizeHtml = require('sanitize-html')
const html2json = require('html2json').html2json;
const axios = require('axios');

module.exports = function getJsonFromUrl(source_url, picture_url) {
  return axios.get(source_url)
    .then(apiRes => {
      const rawHtml = apiRes.data;
      const sanitizedHtml = sanitizeHtml(rawHtml, {
        allowedTags: ['title', 'img', 'ul', 'ol', 'li'],
        allowedAttributes: {
          'img': ['src', 'data-src']
        }
      }).replace(/\n/g, ' ').replace(/\r |\t/g, '').replace(/ +/g, ' ').replace(/&amp;/g, '&');
      
      function findTitle(html) {
        const idx1 = html.indexOf('<title>');
        const idx2 = html.indexOf('</title>');
        return html.slice(idx1 + 7, idx2).split(' - ')[0];
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

      // find the first index where the first tag after 'listName' keyword is an ordered or unordered list
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

      // NEED TO CREATE LOGIC TO CONTROL FOR CONSECUTIVE LISTS WITHIN A SECTION (e.g. allrecipes.co.uk)

      // trim html string to only the specified section (e.g. Ingredients, Preparation, etc.)
      function clipSection(html, section) {
        if (!findList(html, section)) return;
        let clip = html.slice(findList(html, section));

        // find whether ol or ul is used in the DOM
        let closeList = clip.indexOf('<ol>') < clip.indexOf('<ul>') ? '</ol>' : '</ul>'

        let idx2 = clip.indexOf(closeList);
        clip = clip.slice(0, idx2);
        return clip;
      };

      // convert ingredients and directions sections to array
      function createArray(section) {
        const list = section.child.find(el => el.tag === 'ul' || el.tag === 'ol');
        const elements = list.child.reduce((acc, el) => {
          if (el.child) return acc.concat(el.child[0].text);
          else return acc;
        }, [])
        return elements;
      }

      // GET TITLE AND PICTURE URL
      const title = findTitle(sanitizedHtml);

      // Not needed for NY TIMES response - uncomment where necessary
      if (!picture_url) picture_url = findImages(sanitizedHtml);

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