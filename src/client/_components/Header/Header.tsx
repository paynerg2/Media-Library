import React, { Fragment } from 'react';
import { useSelector } from '../../_helpers/useSelector';
import { authenticationActions } from '../../_actions';
import { useDispatch } from 'react-redux';
import { history } from '../../_helpers/history';

const Header: React.FC = () => {
    const { loggedIn, user } = useSelector(state => state.authentication);
    console.log(`isloggedin: ${loggedIn}`);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(authenticationActions.logout());
        history.push('/');
    };

    return (
        <Fragment>
            <span>Header: {loggedIn}</span>
            <div>
                {loggedIn && (
                    <div>
                        {user && <div>logged in as {user.username}</div>}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Header;
