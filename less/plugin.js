const fs = require('fs');

function base64Encode(file) {
  // read binary data
  const bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

module.exports = {
  install(less, pluginManager, functions) {
    //functions.add('f7_coreIconsFont', () => {		
		//	console.log(`f7 plutin coreIconsFont ${process.cwd()}`);
    //  const iconsFontBase64 = base64Encode('../icons/font/f7-core-icons.woff2');
    //  return iconsFontBase64;
    //});
  },
};
