var fs = require('fs');

var buf = fs.readFileSync('./data.json', { encoding: 'utf8', flag: 'r' });

var data = JSON.parse(buf);

var newData = {
    typists: Object.keys(data),
};

// port in regular data, but only preserve session 8 rep 46-50

for (var i = 0; i < newData.typists.length; i++) {
    var currentTypist = newData.typists[i];
    newData[currentTypist] = data[currentTypist][7].slice(-5);
}

/*
Use s002 (arbitrarily chosen) as a base to generate some manipulated versions.
Slow down:
- 's002_0.85x'
- 's002_0.90x'
- 's002_0.95x'
Speed up:
- 's002_1.05x'
- 's002_1.10x'
- 's002_1.15x'
Add 50ms to each "DD" time
- 's002_DDperiodt+50ms'
- 's002_DDti+50ms'
...
- 's002_DDlReturn+50ms'
Add 100ms to each "DD" time
- 's002_DDperiodt+100ms'
- 's002_DDti+100ms'
...
- 's002_DDlReturn+100ms'
Add 150ms
...
Add 200ms
...
Add 400ms
...
*/

var s002Data = newData['s002'];

// manipulate speed (slow down and speed up)
var DDKeys = Object.keys(s002Data[0]).filter((key) => key.startsWith('DD.'));
var speeds = [0.85, 0.9, 0.95, 1.05, 1.1, 1.15];
for (let i = 0; i < speeds.length; i++) {
    var speed = speeds[i];
    var typistName = `s002_${speed.toFixed(2)}x`;
    newData.typists.push(typistName);
    newData[typistName] = [];
    for (var rep = 0; rep < s002Data.length; rep++) {
        var newRepData = Object.assign({}, s002Data[rep]);
        DDKeys.forEach((key) => {
            newRepData[key] = (parseFloat(newRepData[key]) / speed).toFixed(4);
        });
        newData[typistName].push(newRepData);
    }
}

// manipulate absolute milliseconds
var KEYS = ['period', 't', 'i', 'e', 'five', 'Shift.r', 'o', 'a', 'n', 'l', 'Return'];
var addedMilliseconds = [50, 100, 150, 200, 400, 800];
for (let i = 0; i < addedMilliseconds.length; i++) {
    const delta = addedMilliseconds[i];
    for (let j = 0; j < KEYS.length - 1; j++) {
        var typistName = `s002_DD${KEYS[j]}${KEYS[j + 1]}+${delta}ms`;
        newData.typists.push(typistName);
        newData[typistName] = [];
        for (var rep = 0; rep < s002Data.length; rep++) {
            var newRepData = Object.assign({}, s002Data[rep]);
            var manipulatedKey = `DD.${KEYS[j]}.${KEYS[j + 1]}`;
            newRepData[manipulatedKey] = (parseFloat(newRepData[manipulatedKey]) + delta / 1000).toFixed(4);
            newData[typistName].push(newRepData);
        }
    }
}

fs.writeFileSync('../src/assets/data.json', JSON.stringify(newData));
