import { CreatorState, IAction } from '../_interfaces';
import { creatorConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';

export const initialState: CreatorState = {
    allIds: [],
    byId: {},
    selectedCreator: null,
    loading: false,
    error: undefined
};

export const creators = (
    state = initialState,
    action: IAction
): CreatorState => {
    switch (action.type) {
        case creatorConstants.CREATE_REQUEST:
        case creatorConstants.GET_REQUEST:
        case creatorConstants.GET_BY_ID_REQUEST:
        case creatorConstants.UPDATE_REQUEST:
        case creatorConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as CreatorState;
        case creatorConstants.CREATE_FAILURE:
        case creatorConstants.GET_FAILURE:
        case creatorConstants.GET_BY_ID_FAILURE:
        case creatorConstants.UPDATE_FAILURE:
        case creatorConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as CreatorState;
        case creatorConstants.CREATE_SUCCESS:
            const { _id: id, ...payloadWithoutId } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: payloadWithoutId }
            } as CreatorState;

        case creatorConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload)
            } as CreatorState;
        case creatorConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedCreator: action.payload._id,
                error: undefined
            } as CreatorState;
        case creatorConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem },
                loading: false,
                error: undefined
            } as CreatorState;
        case creatorConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const {
                [deletedId]: deletedCreator,
                ...remainingCreators
            } = state.byId;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            return {
                ...state,
                byId: remainingCreators,
                allIds: remainingIds,
                loading: false,
                error: undefined
            } as CreatorState;
        default:
            return state;
    }
};
