/**
 * Checks objects relating to fields on a form provided
 * by Formik to see if any field has been left in an
 * error state. To be used to optionally disable a form's
 * submit button.
 * @param error Error object consisting of keys that map to
 * the names of Formik Fields, and errors associated with those fields.
 * Typically of the form { fieldName: string }; {} if no errors.
 * @param touched Touched object consisting of keys that map to
 * the names of Formik Fields, and whether they have been touched.
 * Typically of the form { fieldName: boolean }
 * @returns True if any named field has been touched and is in an error state.
 *          False otherwise.
 */

export const validationErrorExists = (error: any, touched: any): boolean => {
    let result: boolean = false;
    let keys: string[] = Object.keys(error);
    keys.forEach(key => {
        if (touched[key]) {
            result = result || !!(error[key] && touched[key]);
        }
    });
    return result;
};
