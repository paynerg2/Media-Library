import { BookState, IAction } from '../_interfaces';
import { bookConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';
import { getSeriesIdMap } from '../_helpers/getSeriesIdMap';

export const initialState: BookState = {
    allIds: [],
    byId: {},
    selectedBook: null,
    bySeriesName: {},
    loading: false,
    error: undefined
};

export const books = (state = initialState, action: IAction) => {
    switch (action.type) {
        case bookConstants.CREATE_REQUEST:
        case bookConstants.GET_REQUEST:
        case bookConstants.GET_BY_ID_REQUEST:
        case bookConstants.UPDATE_REQUEST:
        case bookConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as BookState;
        case bookConstants.CREATE_FAILURE:
        case bookConstants.GET_FAILURE:
        case bookConstants.GET_BY_ID_FAILURE:
        case bookConstants.UPDATE_FAILURE:
        case bookConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as BookState;
        case bookConstants.CREATE_SUCCESS:
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
            } as BookState;
        case bookConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                bySeriesName: getSeriesIdMap(action.payload),
                loading: false
            } as BookState;
        case bookConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedBook: action.payload._id
            } as BookState;
        case bookConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem },
                loading: false
            } as BookState;
        case bookConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const matchingSeries = Object.keys(state.bySeriesName).find(key =>
                state.bySeriesName[key].includes(deletedId)
            );
            const { [deletedId]: deletedBook, ...remainingBooks } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            const remainingSeriesIds = matchingSeries
                ? state.bySeriesName[matchingSeries!].filter(
                      seriesId => seriesId !== deletedId
                  )
                : [];
            return {
                ...state,
                byId: remainingBooks,
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
