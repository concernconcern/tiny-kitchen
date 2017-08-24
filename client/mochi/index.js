import Artyom from 'artyom.js';

const Mochi = new Artyom();


Mochi.initialize({
  lang: "en-GB",
  debug: true, // Show what recognizes in the Console
  listen: true, // Start listening after this
  speed: 1.0, // Talk a little bit slow
  mode: "normal", // This parameter is not required as it will be normal by default
  continuous: true,
  soundex: true
})
  .then(console.log('initialized mochi'))
  .catch((err) => {
    console.error("mochi couldn't be initialized: ", err);
  })

export const helpMenu = 'To start cooking, say start, start cooking, play, or read. To pause, say pause or stop. To go to the next step, say next, next step. To go to the previous step, say back, go back, or previous. You can also ask me questions like how many teaspoons are in one tablespoon, or ask me to set a timer for you';
export default Mochi;
