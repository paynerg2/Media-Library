export const mockDocumentQuery: any = {
    select: jest.fn(),
    save: jest.fn()
};

/**
 *
 * @param object Response object, which is expected to either be
 * a single object, or an array of objects in response to a Mongoose
 * query.
 * @returns object with the properties '_id' and '__v' which are
 * provided by MongoDB removed, so that the remaining properties
 * may be compared in a standard assertion.
 */

export const getCleanedResponse = (object: any) => {
    if (!Array.isArray(object)) {
        return cleanObject(object);
    }

    const response = (object as Array<any>).map(item => {
        return cleanObject(item);
    });
    return response;
};

const cleanObject = (object: any) => {
    /**
     * Stringify and then parse to convert Mongoose Documents
     * to plain JS objects - otherwise a handful of virtual
     * properties and functions are returned. This only affects
     * testing of the service layer since converting to JSON
     * gets rid of all of these virtuals.
     * This is a stopgap solution, and will likely be replaed with:
     * TODO: Replace usage of _id with id and query Mongoose models with lean().
     */
    object = JSON.parse(JSON.stringify(object));
    const { _id, __v, ...cleanedObject } = object;
    return cleanedObject;
};
