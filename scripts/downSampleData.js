var fs = require('fs');

var buf = fs.readFileSync('./data.json', { encoding: 'utf8', flag: 'r' });

var data = JSON.parse(buf);

var newData = {
    subjects: Object.keys(data),
};

for (var i = 0; i < newData.subjects.length; i++) {
    var currentSubject = newData.subjects[i];
    newData[currentSubject] = data[currentSubject][7].slice(-10);
}
fs.writeFileSync('../src/assets/data.json', JSON.stringify(newData));
