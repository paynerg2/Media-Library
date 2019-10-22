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
    const { _id, __v, ...cleanedObject } = object;
    return cleanedObject;
};
