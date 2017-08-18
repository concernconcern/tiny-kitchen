import Artyom from 'artyom.js';

const Mochi = new Artyom();


Mochi.initialize({
  lang: "en-GB",
  debug: true, // Show what recognizes in the Console
  listen: true, // Start listening after this
  speed: 0.9, // Talk a little bit slow
  mode: "normal", // This parameter is not required as it will be normal by default
  continuous: true,
  soundex: true
})
  .then(console.log('initialized mochi'))
  .catch((err) => {
    console.error("mochi couldn't be initialized: ", err);
  })

export default Mochi;
