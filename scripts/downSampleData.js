var fs = require('fs');

var buf = fs.readFileSync('./data.json', { encoding: 'utf8', flag: 'r' });

var data = JSON.parse(buf);

var newData = {
    typists: Object.keys(data),
};

for (var i = 0; i < newData.typists.length; i++) {
    var currentTypist = newData.typists[i];
    newData[currentTypist] = data[currentTypist][7].slice(-10);
}
fs.writeFileSync('../src/assets/data.json', JSON.stringify(newData));
