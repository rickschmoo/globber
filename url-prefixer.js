import fs from 'fs';
import fse from 'fs-extra';
import glob from 'glob';

// url patterns to replace
// html files: 
// ===========
// link   -> href
// a      -> href
// svg    -> use -> xlink:href
// script -> src
// img    -> src
// form   -> action
//
// css files
// =========
// url("...")

const urlPrefixConfig = [
  { ext: 'www/**/*.html',
    urlstrings: [
    {
      regMatch: /href=\"\//gm, // <link>, <a>, <use>
    },
    {
      regMatch: /src=\"\//gm, // <script>, <img>
    },
    {
      regMatch: /action=\"\//gm, // <form>
    }]
  },
  { ext: 'www/**/*.css',
    urlstrings: [
    {
      regMatch: /url\(\"\//gm, // <@font-face etc.
    }]
  }
];


function prefixUrls(versionPrefix) {

  urlPrefixConfig.forEach(filetype => {
    console.log(`Prefixing URLs for ${filetype.ext} with ${versionPrefix}`);
    glob.sync(filetype.ext).forEach( f => {
      
      let fileContents = fs.readFileSync(f, 'utf8');

      filetype.urlstrings.forEach(u => {
        fileContents = fileContents.replace(u.regMatch, match => 
          match + versionPrefix + '/'
        );
      })

      fs.writeFileSync(f, fileContents);
    });
  });
}

export default prefixUrls;

