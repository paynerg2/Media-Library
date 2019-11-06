export const ItemSchema = {
    title: { type: String, required: true },
    checkedOut: { type: Boolean, required: true, default: false },
    physical: { type: Boolean, required: true, default: true },
    digital: { type: Boolean, required: true, default: false },
    series: { type: String, required: true },
    publisher: { type: String },
    listPrice: { type: String },
    image: { type: String },
    location: { type: String },
    checkedOutBy: { type: String }
};
