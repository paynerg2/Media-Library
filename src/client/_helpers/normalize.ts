export const normalize = (data: Array<any>): any => {
    let result: any = {};
    data.forEach(item => {
        const { _id, ...rest } = item;
        const id: string = _id;
        result[id] = rest;
    });
    return result;
};
