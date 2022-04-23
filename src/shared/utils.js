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
