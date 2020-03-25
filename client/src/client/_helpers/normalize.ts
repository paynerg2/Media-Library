export const normalize = (data: Array<any>): any => {
    let result: any = {};
    data.forEach(item => {
        result[item._id] = item;
    });
    return result;
};
