import mongoose from 'mongoose';
import { games, initialState } from '../game.reducer';
import { gameConstants } from '../../_constants';
import { GameState, IAction, MongoId } from '../../_interfaces';
import { Game } from '../../../lib/interfaces';

describe('Games Reducer', () => {
    const testErrorMessage = 'test';
    const item1 = mongoose.Types.ObjectId().toHexString();
    const item2 = mongoose.Types.ObjectId().toHexString();
    const testGame: Game = {
        title: 'test',
        checkedOut: true,
        checkedOutBy: item1,
        physical: true,
        digital: true,
        series: item2,
        publisher: item1,
        listPrice: '$616.00',
        image: 'http://www.imagehost.com',
        location: 'test',
        platforms: [item1, item2],
        languages: ['English', 'Test'],
        multiplayer: true,
        genre: 'test'
    };
    const testItemId = mongoose.Types.ObjectId().toHexString();
    const testItem2Id = mongoose.Types.ObjectId().toHexString();
    const testItem: Game & MongoId = {
        ...testGame,
        _id: testItemId
    };
    const testItem2: Game & MongoId = {
        ...testGame,
        _id: testItem2Id
    };
    const requestState: GameState = {
        ...initialState,
        loading: true
    };

    describe('When no action present', () => {
        it('Returns default state if no initial state is present', () => {
            expect(games(undefined, {} as IAction)).toEqual(initialState);
        });

        it('Returns state', () => {
            expect(games(requestState, {} as IAction)).toEqual(requestState);
        });
    });

    describe('Request Actions', () => {
        it('Handles requests by entering a loading state', () => {
            const requestActions = [
                {
                    type: gameConstants.CREATE_REQUEST
                },
                { type: gameConstants.GET_REQUEST },
                { type: gameConstants.GET_BY_ID_REQUEST },
                { type: gameConstants.UPDATE_REQUEST },
                { type: gameConstants.DELETE_REQUEST }
            ];
            requestActions.forEach(action => {
                expect(games(initialState, action)).toEqual(requestState);
            });
        });
    });

    describe('Failure Actions', () => {
        it('Handles failure by setting an error state', () => {
            const failureActions = [
                {
                    type: gameConstants.CREATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: gameConstants.GET_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: gameConstants.GET_BY_ID_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: gameConstants.UPDATE_FAILURE,
                    error: Error(testErrorMessage)
                },
                {
                    type: gameConstants.DELETE_FAILURE,
                    error: Error(testErrorMessage)
                }
            ];
            const expectedState: GameState = {
                ...initialState,
                error: Error(testErrorMessage)
            };
            failureActions.forEach(action => {
                expect(games(initialState, action)).toEqual(expectedState);
            });
        });
    });

    describe('Success Actions', () => {
        describe('Create', () => {
            const action: IAction = {
                type: gameConstants.CREATE_SUCCESS,
                payload: testItem
            };
            it('Adds the item correctly to state', () => {
                const expectedState: GameState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testItem
                    },
                    allIds: [testItem._id]
                };
                expect(games(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get All', () => {
            const action: IAction = {
                type: gameConstants.GET_SUCCESS,
                payload: [testItem, testItem2]
            };
            it('Adds items correctly to state', () => {
                const expectedState: GameState = {
                    ...requestState,
                    loading: false,
                    byId: {
                        [testItem._id]: testItem,
                        [testItem2._id]: testItem2
                    },
                    allIds: [testItem._id, testItem2._id]
                };
                expect(games(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Get By Id', () => {
            it('Correctly adds returned id to selectedCompany in state', () => {
                const action: IAction = {
                    type: gameConstants.GET_BY_ID_SUCCESS,
                    payload: testItem
                };
                const expectedState: GameState = {
                    ...requestState,
                    loading: false,
                    selectedGame: testItem._id
                };
                expect(games(requestState, action)).toEqual(expectedState);
            });
        });

        describe('Update', () => {
            it('Correctly updates a company', async () => {
                const testUpdate: Game & MongoId = {
                    ...testItem,
                    checkedOut: !testItem.checkedOut
                };
                const action: IAction = {
                    type: gameConstants.UPDATE_SUCCESS,
                    payload: testUpdate
                };
                const preUpdateState: GameState = {
                    ...requestState,
                    byId: {
                        [testItem._id]: testItem
                    },
                    allIds: [testItem._id]
                };
                const expectedState: GameState = {
                    ...preUpdateState,
                    byId: {
                        [testUpdate._id]: testUpdate
                    },
                    loading: false
                };
                expect(games(preUpdateState, action)).toEqual(expectedState);
            });
        });

        describe('Delete', () => {
            it('Correctly removes a company from state', () => {
                const action = {
                    type: gameConstants.DELETE_SUCCESS,
                    payload: testItem2._id
                };
                const preDeleteState: GameState = {
                    ...requestState,
                    byId: {
                        [testItem._id]: testItem,
                        [testItem2._id]: testItem2
                    },
                    allIds: [testItem._id, id]
                };
                const expectedState: GameState = {
                    ...preDeleteState,
                    byId: { [id]: testItem },
                    allIds: [id],
                    loading: false
                };
                expect(games(preDeleteState, action)).toEqual(expectedState);
            });
        });
    });
});
