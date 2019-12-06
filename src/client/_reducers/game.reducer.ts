import { GameState, IAction } from '../_interfaces';
import { gameConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';
import { getSeriesIdMap } from '../_helpers/getSeriesIdMap';

export const initialState: GameState = {
    allIds: [],
    byId: {},
    bySeriesName: {},
    selectedGame: null,
    loading: false,
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
            const { series } = action.payload;
            const seriesIds: string[] = state.bySeriesName[series];
            const { _id: id, ...payloadWithoutId } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: payloadWithoutId },
                bySeriesName: {
                    ...state.bySeriesName,
                    [series]: seriesIds ? [...seriesIds, id] : [id]
                },
                loading: false
            } as GameState;
        case gameConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                bySeriesName: getSeriesIdMap(action.payload),
                loading: false
            } as GameState;
        case gameConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedGame: action.payload._id
            } as GameState;
        case gameConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem },
                loading: false
            } as GameState;
        case gameConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const matchingSeries = Object.keys(state.bySeriesName).find(key =>
                state.bySeriesName[key].includes(deletedId)
            );
            const { [deletedId]: deletedGame, ...remainingGames } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            const remainingSeriesIds = matchingSeries
                ? state.bySeriesName[matchingSeries!].filter(
                      seriesId => seriesId !== deletedId
                  )
                : [];
            return {
                ...state,
                byId: remainingGames,
                allIds: remainingIds,
                bySeriesName: matchingSeries
                    ? {
                          ...state.bySeriesName,
                          [matchingSeries]: remainingSeriesIds
                      }
                    : state.bySeriesName,
                loading: false
            };
        default:
            return state;
    }
};
