import { DiscState, IAction } from '../_interfaces';
import { discConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';

export const initialState: DiscState = {
    allIds: [],
    byId: {},
    selectedDisc: null,
    loading: true,
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
            const { _id: id } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: action.payload },
                loading: false
            } as DiscState;
        case discConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                loading: false
            } as DiscState;
        case discConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedDisc: action.payload._id
            } as DiscState;
        case discConstants.UPDATE_SUCCESS:
            return {
                ...state,
                byId: { ...state.byId, [action.payload._id]: action.payload },
                loading: false
            } as DiscState;
        case discConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const { [deletedId]: deletedDisc, ...remainingDiscs } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            return {
                ...state,
                byId: remainingDiscs,
                allIds: remainingIds,
                loading: false
            };
        default:
            return state;
    }
};
