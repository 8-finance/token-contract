const fs = require('fs');
console.log(__dirname+'/../')
// File destination.txt will be created or overwritten by default.
fs.copyFile(__dirname+'/../kvabi.json', __dirname+'/../../es/kvabi.json', (err) => {
  if (err) throw err;
  console.log('kvabi.json was copied to "es" directory');
});

fs.copyFile(__dirname+'/../kvabi.json', __dirname+'/../../lib/kvabi.json', (err) => {
  if (err) throw err;
  console.log('kvabi.json was copied to "lib" directory');
});
