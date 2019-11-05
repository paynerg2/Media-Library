export interface Item {
    title: string;
    checkedOut: boolean;
    physical: boolean;
    series: string;
    publisher?: string;
    listPrice?: string;
    image?: string;
    location?: string;
    checkedOutBy?: string;
}
