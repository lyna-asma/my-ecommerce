//A “middle step” between 
// writing CSS and sending it to the browsers
// this file tells which PostCSS plugins to use

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
