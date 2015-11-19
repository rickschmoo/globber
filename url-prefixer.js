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
  { ext: '**/*.html',
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
  { ext: '**/*.css',
    urlstrings: [
    {
      regMatch: /url\(\"\//gm, // <@font-face etc.
    }]
  }
];


function prefixUrls(dir, versionPrefix) {

  urlPrefixConfig.forEach(filetype => {
    let fileCount = 0;
    glob.sync(`${dir}/${filetype.ext}`).forEach( f => {
      fileCount++;
      let fileContents = fs.readFileSync(f, 'utf8');
      filetype.urlstrings.forEach(u => {
        fileContents = fileContents.replace(u.regMatch, match => 
          match + versionPrefix + '/'
        );
      })

      fs.writeFileSync(f, fileContents);
    });
    console.log(`Prefixing the URLs in ${fileCount} files matching ${dir}/${filetype.ext} with ${versionPrefix}`);
  });
}

export default prefixUrls;

