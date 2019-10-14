import { itemSchema } from '../item.schema';
import {
    physicalRequired,
    digitalRequired,
    publisherRequired
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
            physical: false,
            digital: false,
            publisher: 'test'
        };

        const testItem2 = {
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

    it('Returns an error when physical field not included', async () => {
        const testItem = {
            digital: true,
            publisher: 'test'
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('physical');
        expect(error.message).toEqual(physicalRequired);
    });

    it('Returns an error when digital field not included', async () => {
        const testItem = {
            physical: true,
            publisher: 'test'
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('digital');
        expect(error.message).toEqual(digitalRequired);
    });

    it('Returns an error when publisher field not included', async () => {
        const testItem = {
            digital: true,
            physical: true
        };

        const error = await validateItem(testItem);
        expect(error.path).toEqual('publisher');
        expect(error.message).toEqual(publisherRequired);
    });
});
