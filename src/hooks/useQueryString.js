// not really a hook here, but I am lazy to set up react router dom

const useQueryString = () => {
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

export default useQueryString;
