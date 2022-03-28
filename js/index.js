var SUBJECT = 's022';
var SESSION = 6; // 0 - 7
var REP = 49; // 0 - 49

var rawTypingData = data[SUBJECT][SESSION][REP];

/* the password is: .tie5Roanl
 */
var keys = ['period', 't', 'i', 'e', 'five', 'Shift.r', 'o', 'a', 'n', 'l', 'Return'];
/*
 * to make the key typing more "rhythmetic", using a harder "key" press for "period", "five" and "Return"
 */
var isKeyPressedHard = [true, false, false, false, false, true, false, false, false, false, true];

/*
 * downDownTimerStart stores the starting time when a keystroke shall be played since t=0
 */
var downDownTimerStart = [0];
for (i = 1; i < keys.length; i++) {
    downDownTimerStart[i] =
        downDownTimerStart[i - 1] + Math.round(parseFloat(rawTypingData[`DD.${keys[i - 1]}.${keys[i]}`]) * 1000);
}
console.log('downDownTimerStart', downDownTimerStart);

function setKeystrokeTimer(keyIndex) {
    var startTime = downDownTimerStart[keyIndex];
    var sound = new Audio();
    var src = document.createElement('source');
    src.type = 'audio/mpeg';
    if (isKeyPressedHard[keyIndex]) {
        src.src = '../assets/keystroke-hard.mp3';
        sound.appendChild(src);
        setTimeout(() => {
            sound.play();
        }, startTime);
    } else {
        src.src = '../assets/keystroke-click.mp3';
        sound.appendChild(src);
        setTimeout(() => {
            sound.play();
        }, startTime);
    }
}

function playKeySequence() {
    for (i = 0; i < downDownTimerStart.length; i++) {
        var _setKeystrokeTimer = setKeystrokeTimer.bind(this);
        _setKeystrokeTimer(i);
    }
}
