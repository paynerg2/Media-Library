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
            const { _id: id } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: action.payload }
            } as SeriesState;

        case seriesConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload)
            } as SeriesState;
        case seriesConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedSeries: action.payload._id,
                error: undefined
            } as SeriesState;
        case seriesConstants.UPDATE_SUCCESS:
            return {
                ...state,
                byId: { ...state.byId, [action.payload._id]: action.payload },
                loading: false,
                error: undefined
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
                allIds: remainingIds,
                loading: false,
                error: undefined
            } as SeriesState;
        default:
            return state;
    }
};
