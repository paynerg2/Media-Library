/**
 * @description Returns key-value pairs from an object which match
 * a list of allowed keys.
 * @param object Object expected in the form of a String T Map
 * @param allowedKeys Array of strings
 * @returns Object in the form of a String T Map
 */

export const filterByKeys = (object: any, allowedKeys: Array<string>): any => {
    const filteredObj = Object.keys(object)
        .filter(key => allowedKeys.includes(key))
        .reduce((obj: any, key: string) => {
            obj[key] = object[key];
            return obj;
        }, {});
    return filteredObj;
};
