var assert = function (value, msg) {
    if (!value) {
        throw (msg || value + "does not equal true");
    }
}

var assertEual = function (val1, val2, msg) {
    if (val1 !== val2) {
        throw (msg || val1 + "does not equal" + val2);
    }
}

/**
 * 产生一个id
 */
Math.guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
};

