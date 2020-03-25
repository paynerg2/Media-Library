import { Creator } from '../../lib/interfaces';
import { MongoId } from '../_interfaces';

export const getFullName = (creator: Creator | (Creator & MongoId)) => {
    let fullName = creator.firstName;
    if (creator.middleInitials) {
        fullName = `${fullName} ${creator.middleInitials}`;
    }
    if (creator.lastName) {
        fullName = `${fullName} ${creator.lastName}`;
    }
    return fullName;
};
