export interface Item {
    title: string;
    checkedOut: boolean;
    physical: boolean;
    digital: boolean;
    series: string;
    publisher?: string;
    listPrice?: string;
    image?: string;
    location?: string;
    checkedOutBy?: string;
}

export const defaultItem: Item = {
    title: '',
    checkedOut: false,
    physical: false,
    digital: false,
    series: '',
    publisher: '',
    listPrice: '',
    image: '',
    location: '',
    checkedOutBy: ''
};
