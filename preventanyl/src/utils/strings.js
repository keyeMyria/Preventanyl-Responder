export const replaceAllRegex = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement);
};

export const replaceAll = (target, search, replacement) => {
    return target.split(search).join(replacement);
}