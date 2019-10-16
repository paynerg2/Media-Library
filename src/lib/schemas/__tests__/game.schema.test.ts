import { gameSchema } from '../';
import {
    platformIsRequired,
    multiplayerMustBeIndicated
} from '../../messages/game.errorMessages';

describe('Game Schema', () => {
    const validateGame = async (game: any) => {
        let error;
        try {
            await gameSchema.validate(game);
        } catch (e) {
            error = e;
        }
        return error;
    };

    it('Does not reject when all requried fields are present', async () => {
        // Minimal required properties
        const testGame = {
            title: 'test',
            physical: true,
            digital: true,
            publisher: 'test',
            platforms: ['test'],
            multiplayer: true
        };

        // All properties present
        const testGame2 = {
            title: 'test',
            physical: true,
            digital: true,
            publisher: 'test',
            platforms: ['test'],
            multiplayer: true,
            series: 'test',
            location: 'test',
            listPrice: 'test usd',
            image: 'http://www.test.com',
            checkedOut: false,
            checkedOutBy: 'test',
            languages: ['test', 'testlanguage'],
            genre: 'test'
        };

        const error = await validateGame(testGame);
        const error2 = await validateGame(testGame2);

        expect(error).toBeUndefined();
        expect(error2).toBeUndefined();
    });

    it('Returns an error when at least one platform is not specified', async () => {
        // Absent field
        const testGame = {
            title: 'test',
            physical: true,
            digital: true,
            publisher: 'test',
            multiplayer: true
        };
        // Default field (unspecified)
        const testGame2 = {
            title: 'test',
            physical: true,
            digital: true,
            publisher: 'test',
            platforms: [],
            multiplayer: true
        };

        const error = await validateGame(testGame);
        const error2 = await validateGame(testGame2);

        expect(error.path).toEqual('platforms');
        expect(error2.path).toEqual('platforms');
        expect(error.message).toEqual(platformIsRequired);
        expect(error2.message).toEqual(platformIsRequired);
    });

    it('Returns an error when multiplayer field is not present', async () => {
        const testGame = {
            title: 'test',
            physical: true,
            digital: true,
            publisher: 'test',
            platforms: ['test']
        };

        const error = await validateGame(testGame);
        expect(error.path).toEqual('multiplayer');
        expect(error.message).toEqual(multiplayerMustBeIndicated);
    });
});
