import * as yup from 'yup';
import {
    physicalRequired,
    digitalRequired,
    publisherRequired,
    titleIsRequired
} from '../messages/item.errorMessages';

export const itemSchema: yup.ObjectSchema = yup.object().shape({
    title: yup.string().required(titleIsRequired),
    physical: yup.boolean().required(physicalRequired),
    digital: yup.boolean().required(digitalRequired),
    series: yup.string(),
    publisher: yup.string().required(publisherRequired),
    location: yup.string(),
    listPrice: yup.string(),
    image: yup.string().url(),
    checkedOut: yup.boolean().default(false),
    checkedOutBy: yup.string()
});
