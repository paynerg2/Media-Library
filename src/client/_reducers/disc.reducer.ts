import { DiscState, IAction } from '../_interfaces';
import { discConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';
import { getSeriesIdMap } from '../_helpers/getSeriesIdMap';

export const initialState: DiscState = {
    allIds: [],
    byId: {},
    bySeriesName: {},
    selectedDisc: null,
    loading: false,
    error: undefined
};

export const discs = (state = initialState, action: IAction) => {
    switch (action.type) {
        case discConstants.CREATE_REQUEST:
        case discConstants.GET_REQUEST:
        case discConstants.GET_BY_ID_REQUEST:
        case discConstants.UPDATE_REQUEST:
        case discConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as DiscState;
        case discConstants.CREATE_FAILURE:
        case discConstants.GET_FAILURE:
        case discConstants.GET_BY_ID_FAILURE:
        case discConstants.UPDATE_FAILURE:
        case discConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as DiscState;
        case discConstants.CREATE_SUCCESS:
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
            } as DiscState;
        case discConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                bySeriesName: getSeriesIdMap(action.payload),
                loading: false
            } as DiscState;
        case discConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedDisc: action.payload._id
            } as DiscState;
        case discConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem },
                loading: false
            } as DiscState;
        case discConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const matchingSeries = Object.keys(state.bySeriesName).find(key =>
                state.bySeriesName[key].includes(deletedId)
            );
            const { [deletedId]: deletedDisc, ...remainingDiscs } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            const remainingSeriesIds = matchingSeries
                ? state.bySeriesName[matchingSeries!].filter(
                      seriesId => seriesId !== deletedId
                  )
                : [];
            return {
                ...state,
                byId: remainingDiscs,
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
