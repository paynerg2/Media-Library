export const getSeriesIdMap = (data: Array<any>): any => {
    if (!data) return {};

    let result: any = {};
    data.forEach(item => {
        const { series } = item;
        result[series] = result[series]
            ? [...result[series], item._id]
            : [item._id];
    });
    return result;
};
