import { GameState, IAction } from '../_interfaces';
import { gameConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';

export const initialState: GameState = {
    allIds: [],
    byId: {},
    selectedGame: null,
    loading: true,
    error: undefined
};

export const games = (state = initialState, action: IAction) => {
    switch (action.type) {
        case gameConstants.CREATE_REQUEST:
        case gameConstants.GET_REQUEST:
        case gameConstants.GET_BY_ID_REQUEST:
        case gameConstants.UPDATE_REQUEST:
        case gameConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as GameState;
        case gameConstants.CREATE_FAILURE:
        case gameConstants.GET_FAILURE:
        case gameConstants.GET_BY_ID_FAILURE:
        case gameConstants.UPDATE_FAILURE:
        case gameConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as GameState;
        case gameConstants.CREATE_SUCCESS:
            const { _id: id } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: action.payload },
                loading: false
            } as GameState;
        case gameConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                loading: false
            } as GameState;
        case gameConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedGame: action.payload._id
            } as GameState;
        case gameConstants.UPDATE_SUCCESS:
            return {
                ...state,
                byId: { ...state.byId, [action.payload._id]: action.payload },
                loading: false
            } as GameState;
        case gameConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const { [deletedId]: deletedGame, ...remainingGames } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            return {
                ...state,
                byId: remainingGames,
                allIds: remainingIds,
                loading: false
            };
        default:
            return state;
    }
};
