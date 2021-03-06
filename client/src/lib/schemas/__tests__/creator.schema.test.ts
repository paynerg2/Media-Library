import { creatorSchema } from '../creator.schema';
import { firstNameIsRequired } from '../../messages/creator.errorMessages';
import { Creator } from '../../interfaces';

describe('Creator Schema', () => {
    const validateCreator = async (creator: any) => {
        let error;
        try {
            await creatorSchema.validate(creator);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all required fields are present', async () => {
        const testCreator: Creator = {
            firstName: 'test',
            works: ['test', 'test']
        };
        const error = await validateCreator(testCreator);
        expect(error).toBeUndefined();
    });

    it('Does not reject when all fields are present', async () => {
        const testCreator: Creator = {
            firstName: 'test',
            middleInitials: 'T.',
            lastName: 'test',
            works: ['test', 'test']
        };
        const error = await validateCreator(testCreator);
        expect(error).toBeUndefined();
    });

    it('Returns an error if firstName not present', async () => {
        const testCreator = {
            lastName: 'test',
            works: ['test', 'test']
        };
        const error = await validateCreator(testCreator);
        expect(error.path).toEqual('firstName');
        expect(error.message).toEqual(firstNameIsRequired);
    });
});
