import { CompanyState, IAction } from '../_interfaces';
import { companyConstants } from '../_constants';
import { normalize } from '../_helpers/normalize';
import { getTitleIdMap } from '../_helpers/getTitleIdMap';

export const initialState: CompanyState = {
    allIds: [],
    byId: {},
    byName: {},
    selectedCompany: null,
    loading: false,
    error: undefined
};

export const companies = (
    state = initialState,
    action: IAction
): CompanyState => {
    switch (action.type) {
        case companyConstants.CREATE_REQUEST:
        case companyConstants.GET_REQUEST:
        case companyConstants.GET_BY_ID_REQUEST:
        case companyConstants.UPDATE_REQUEST:
        case companyConstants.DELETE_REQUEST:
            return {
                ...state,
                loading: true
            } as CompanyState;
        case companyConstants.CREATE_FAILURE:
        case companyConstants.GET_FAILURE:
        case companyConstants.GET_BY_ID_FAILURE:
        case companyConstants.UPDATE_FAILURE:
        case companyConstants.DELETE_FAILURE:
            return {
                ...state,
                error: action.error
            } as CompanyState;
        case companyConstants.CREATE_SUCCESS:
            const { name } = action.payload;
            const { _id: id, ...payloadWithoutId } = action.payload;
            return {
                ...initialState,
                allIds: [...state.allIds, id],
                byId: { ...state.byId, [id]: payloadWithoutId },
                byName: { ...state.byName, [name]: id },
                loading: false
            } as CompanyState;
        case companyConstants.GET_SUCCESS:
            return {
                ...initialState,
                allIds: action.payload.map((item: any) => item._id),
                byId: normalize(action.payload),
                byName: getTitleIdMap(action.payload),
                loading: false
            } as CompanyState;
        case companyConstants.GET_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedCompany: action.payload._id
            } as CompanyState;
        case companyConstants.UPDATE_SUCCESS:
            const { _id, ...updatedItem } = action.payload;
            return {
                ...state,
                byId: { ...state.byId, [_id]: updatedItem },
                loading: false
            } as CompanyState;
        case companyConstants.DELETE_SUCCESS:
            const deletedId = action.payload;
            const {
                [deletedId]: deletedCompany,
                ...remainingCompanies
            } = state.byId;
            const {
                [deletedCompany.name]: delId,
                ...remainingNames
            } = state.byName;
            const remainingIds = state.allIds.filter(id => id !== deletedId);
            return {
                ...state,
                byId: remainingCompanies,
                allIds: remainingIds,
                byName: remainingNames,
                loading: false
            };
        default:
            return state;
    }
};
