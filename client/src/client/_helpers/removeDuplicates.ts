export const removeDuplicates = (arr: Array<string>): Array<string> => {
    const uniqueSet: Set<string> = new Set(arr);
    return [...uniqueSet];
};
