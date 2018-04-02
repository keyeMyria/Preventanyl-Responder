export const replaceAllRegex = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement);
};

export const replaceAll = (target, search, replacement) => {
    return target.split(search).join(replacement);
}

export const wordWrap = (str, maxWidth) => {
    newLineStr = "\n"; 
    done = false; 
    res = '';
    
    while (!done) {              
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; --i)
            if (whiteSpaceFind (str.charAt (i))) {
                res = res + [str.slice (0, i), newLineStr].join ('');
                str = str.slice (i + 1);
                found = true;
                break;
            }

        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
            done = true;
    }

    return res + str;
}

export const whiteSpaceFind = (x) => {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

export const formatAddressObjectForMarker = (address) => {
    return `${ address.city }\n${ address.streetAddress }`
}

export const formatAddressObject = (address) => {
    return `${ address.country }\n${ address.province }\n${ address.city }\n${ address.postalCode }\n${ address.streetAddress}`
}