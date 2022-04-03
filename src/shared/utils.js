import Data from '../assets/data.json';
const firstSubject = Data.subjects[0];

export const rangeValue = (oldVal, _newVal, minVal, maxVal = Infinity) => {
    const newVal = parseInt(_newVal);
    if (isNaN(newVal)) return oldVal;
    return Math.min(Math.max(newVal, minVal), maxVal);
};

export const rangeValue_repsPerTrainingClip = (oldVal, newVal) => {
    return rangeValue(oldVal, newVal, 1, Data[firstSubject].length - 1);
};

export const rangeValue_silenceBetweenReps = (oldVal, newVal) => {
    return rangeValue(oldVal, newVal, 500);
};

export const stopAllAudios = () => {
    const allAudios = document.getElementsByTagName('audio');
    // console.log(allAudios);
    for (let i = 0; i < allAudios.length; i++) allAudios[i].pause();
};
