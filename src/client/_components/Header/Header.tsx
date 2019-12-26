import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from '../../_hooks';
import { authenticationActions } from '../../_actions';
import { useDispatch } from 'react-redux';
import { history } from '../../_helpers/history';

const Header: React.FC = () => {
    const { loggedIn } = useSelector(state => state.authentication);
    const [user, setUser] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUser = window.localStorage.getItem('user');
            let username = '';
            if (currentUser) {
                username = JSON.parse(currentUser).username;
            }
            currentUser && setUser(username);
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(authenticationActions.logout());
        history.push('/');
    };

    return (
        <Fragment>
            <span>Header: {loggedIn || !!user}</span>
            <div>
                {loggedIn ||
                    (user && (
                        <div>
                            {user && <div>logged in as {user}</div>}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ))}
            </div>
        </Fragment>
    );
};

export default Header;
