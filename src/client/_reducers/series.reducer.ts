import { SeriesState, IAction } from '../_interfaces';
import { seriesConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';

export const initialState: SeriesState = {
    allIds: [],
    byId: {},
    selectedSeries: null,
    loading: false,
    error: undefined
};

export const series = (state = initialState, action: IAction): SeriesState => {
    switch (action.type) {
        case seriesConstants.CREATE_REQUEST:
        case seriesConstants.GET_REQUEST:
        case seriesConstants.GET_BY_ID_REQUEST:
        case seriesConstants.UPDATE_REQUEST:
        case seriesConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as SeriesState;
        case seriesConstants.CREATE_FAILURE:
        case seriesConstants.GET_FAILURE:
        case seriesConstants.GET_BY_ID_FAILURE:
        case seriesConstants.UPDATE_FAILURE:
        case seriesConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as SeriesState;
        case seriesConstants.CREATE_SUCCESS:
            const { _id: id, ...payloadWithoutId } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: payloadWithoutId },
                loading: false
            } as SeriesState;

        case seriesConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                loading: false
            } as SeriesState;
        case seriesConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedSeries: action.payload._id
            } as SeriesState;
        case seriesConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem }
            } as SeriesState;
        case seriesConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const {
                [deletedId]: deletedSeries,
                ...remainingSeries
            } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            return {
                ...state,
                byId: remainingSeries,
                allIds: remainingIds
            } as SeriesState;
        default:
            return initialState;
    }
};
