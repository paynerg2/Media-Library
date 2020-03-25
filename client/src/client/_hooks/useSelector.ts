import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
    shallowEqual
} from 'react-redux';
import { RootState } from '../_reducers';

/**
 *
 * @param selector Selector function, used to return
 * parameters from the Redux store. Takes the current state
 * as first parameter.
 * @returns Custom typed useShallowEqualSelector hook, similar to
 * the recipe provided in React Redux docs.
 */
export const useSelector: TypedUseSelectorHook<RootState> = selector =>
    useReduxSelector(selector, shallowEqual);
