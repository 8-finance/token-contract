const fs = require("fs");
console.log(__dirname + "/../");
// File destination.txt will be created or overwritten by default.
fs.copyFile(
  __dirname + "/../eightfin.json",
  __dirname + "/../../es/eightfin.json",
  (err) => {
    if (err) throw err;
    console.log('eightfin.json was copied to "es" directory');
  }
);

fs.copyFile(
  __dirname + "/../eightfin.json",
  __dirname + "/../../lib/eightfin.json",
  (err) => {
    if (err) throw err;
    console.log('eightfin.json was copied to "lib" directory');
  }
);

fs.copyFile(
  __dirname + "/../privatesale.json",
  __dirname + "/../../es/privatesale.json",
  (err) => {
    if (err) throw err;
    console.log('privatesale.json was copied to "es" directory');
  }
);

fs.copyFile(
  __dirname + "/../privatesale.json",
  __dirname + "/../../lib/privatesale.json",
  (err) => {
    if (err) throw err;
    console.log('privatesale.json was copied to "lib" directory');
  }
);
