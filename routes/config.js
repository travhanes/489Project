const { config } = require('dotenv');




// load configuration based on environment
const { error, parsed } = config({
  path: '.env.sandbox',
});




// export secrets stored in .env.production or .env.sandbox (based on .env.example)
module.exports = {
  ...parsed,
};
