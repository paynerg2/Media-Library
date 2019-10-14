import React, { Fragment } from 'react';
import { useSelector } from '../../_helpers/useSelector';
import { authenticationActions } from '../../_actions';
import { useDispatch, shallowEqual } from 'react-redux';
import { history } from '../../_helpers/history';

const Header: React.FC = () => {
    const isLoggedIn = useSelector(state => state.authentication.loggedIn);
    console.log(`isloggedin: ${isLoggedIn}`);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authenticationActions.logout());
        history.push('/');
    };

    return (
        <Fragment>
            <span>Header: {isLoggedIn}</span>
            <div>
                {isLoggedIn && (
                    <div>
                        <div>'user is logged in!'</div>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Header;
