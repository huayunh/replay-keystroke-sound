import Data from '../assets/data.json';
import { KEYS } from './constants';
const firstTypist = Data.typists[0];

export const rangeValue = (oldVal, _newVal, minVal, maxVal = Infinity) => {
    const newVal = parseInt(_newVal);
    if (isNaN(newVal)) return oldVal;
    return Math.min(Math.max(newVal, minVal), maxVal);
};

export const rangeValue_repsPerTrainingClip = (oldVal, newVal) => {
    return rangeValue(oldVal, newVal, 1, Data[firstTypist].length - 1);
};

export const rangeValue_silenceBetweenReps = (oldVal, newVal) => {
    return rangeValue(oldVal, newVal, 500);
};

export const stopAllAudios = () => {
    const allAudios = document.getElementsByTagName('audio');
    for (let i = 0; i < allAudios.length; i++) {
        allAudios[i].pause();
        allAudios[i].remove();
    }
};

export const randomItemsFromArray = (array, n) => {
    return array.sort(() => 0.5 - Math.random()).slice(0, n);
};

export const getRandomInt = (n) => {
    return Math.floor(n * Math.random());
};

export const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export const getDownDownStartTimes = (reps, silenceBetweenReps) => {
    const downDownTimerStart = [];
    reps.forEach((rep, repIndex) => {
        const newRepStart = downDownTimerStart.length;
        if (repIndex !== 0) {
            downDownTimerStart[newRepStart] = downDownTimerStart[newRepStart - 1] + silenceBetweenReps;
        } else {
            downDownTimerStart[0] = 0;
        }
        for (let i = 1; i < KEYS.length; i++) {
            downDownTimerStart[newRepStart + i] =
                downDownTimerStart[newRepStart + i - 1] +
                Math.round(parseFloat(rep[`DD.${KEYS[i - 1]}.${KEYS[i]}`]) * 1000);
        }
    });
    return downDownTimerStart;
};

export const getURLParameterObject = () => {
    const ret = {};

    const search = document.location.search;

    if (search === '' || search === '?') {
        return ret;
    }

    const parameters = search.slice(1).split('&');

    parameters.forEach((parameter) => {
        const keyVal = parameter.split('=', 2);
        if (keyVal.length > 1) {
            ret[keyVal[0]] = decodeURIComponent(keyVal[1]);
        }
    });
    return ret;
};

export const objectToURLParameter = (obj) => {
    const objectKeys = Object.keys(obj);
    if (objectKeys.length === 0) {
        return '';
    }
    let URI = '?';
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
            URI += `${encodeURI(key)}=${encodeURIComponent(obj[key])}&`;
        }
    }
    // get rid of the last "&"
    return URI.slice(0, -1);
};

export const millisecondToHMS = (n) => {
    const second = Math.floor(n / 1000);
    const ret = {
        hour: Math.floor(second / 3600),
        minute: Math.floor((second % 3600) / 60)
            .toString()
            .padStart(2, '0'),
        second: (second % 60).toString().padStart(2, '0'),
        millisecond: (n % 1000).toString().padStart(3, '0'),
    };
    ret.string = `${ret.hour}:${ret.minute}:${ret.second}.${ret.millisecond}`;
    return ret;
};

export const localeDateToISO = (date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date
        .getMilliseconds()
        .toString()
        .padStart(3, '0')}`;

export const UTCDateToISO = (date) =>
    `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date
        .getUTCDate()
        .toString()
        .padStart(2, '0')} ${date.getUTCHours().toString().padStart(2, '0')}:${date
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}.${date
        .getUTCMilliseconds()
        .toString()
        .padStart(3, '0')}`;

export const localeDateToISONoPunct = (date) =>
    `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date
        .getDate()
        .toString()
        .padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}${date
        .getMilliseconds()
        .toString()
        .padStart(3, '0')}`;
