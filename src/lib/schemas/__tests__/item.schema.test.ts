import { itemSchema } from '../item.schema';
import {
    physicalRequired,
    digitalRequired,
    publisherRequired,
    titleIsRequired
} from '../../messages/item.errorMessages';

describe('Item Schema', () => {
    const validateItem = async (item: any) => {
        let error;
        try {
            await itemSchema.validate(item);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when required fields are present', async () => {
        const testItem = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const testItem2 = {
            title: 'test',
            physical: false,
            digital: false,
            publisher: 'test',
            series: 'test',
            location: 'test',
            listPrice: 'test usd',
            image: 'test.com',
            checkedOut: false,
            checkedOutBy: 'test'
        };

        const error = await validateItem(testItem);
        const error2 = await validateItem(testItem);

        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });

    it('Returns an error when title field not included', async () => {
        const testItem = {
            physical: true,
            digital: true,
            publisher: 'test'
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('title');
        expect(error.message).toEqual(titleIsRequired);
    });

    it('Returns an error when physical field not included', async () => {
        const testItem = {
            title: 'test',
            digital: true,
            publisher: 'test'
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('physical');
        expect(error.message).toEqual(physicalRequired);
    });

    it('Returns an error when digital field not included', async () => {
        const testItem = {
            title: 'test',
            physical: true,
            publisher: 'test'
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('digital');
        expect(error.message).toEqual(digitalRequired);
    });

    it('Returns an error when publisher field not included', async () => {
        const testItem = {
            title: 'test',
            digital: true,
            physical: true
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('publisher');
        expect(error.message).toEqual(publisherRequired);
    });
});
