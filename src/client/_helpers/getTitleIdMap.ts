export const getTitleIdMap = (data: Array<any>): any => {
    let result: any = {};
    data.forEach(item => {
        const { _id, name, title } = item;
        const id: string = _id;
        if (name) {
            result[name] = id;
        }
        if (title) {
            result[title] = id;
        }
    });
    return result;
};
