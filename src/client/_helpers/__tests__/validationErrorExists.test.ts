import { validationErrorExists } from '../validationErrorExists';

describe('Validation Error Exists Helper Function ', () => {
    it('Returns false if no errors or touched fields', () => {
        const errors = {};
        const touched = {};
        const result = validationErrorExists(errors, touched);
        expect(result).toEqual(false);
    });

    it('Returns false if no errors, regardless of touched fields', () => {
        const errors = {};
        const touched = {
            test: true,
            test2: false,
            test3: true
        };
        const result = validationErrorExists(errors, touched);
        expect(result).toEqual(false);
    });

    it('Returns false if errors do not match touched fields', () => {
        const errors = {
            test: 'test error',
            test3: 'test error'
        };
        const touched = {
            test: false,
            test2: true,
            test3: false
        };
        const result = validationErrorExists(errors, touched);
        expect(result).toEqual(false);
    });

    it('Returns true if errors match touched fields', () => {
        const errors = {
            test: 'test error'
        };
        const touched = {
            test: true,
            test2: false,
            test3: false
        };
        const result = validationErrorExists(errors, touched);
        expect(result).toEqual(true);
    });

    it('Returns true if multiple errors match touched fields', () => {
        const errors = {
            test: 'test error',
            test3: 'test error'
        };
        const touched = {
            test: true,
            test2: true,
            test3: true
        };
        const result = validationErrorExists(errors, touched);
        expect(result).toEqual(true);
    });
});
