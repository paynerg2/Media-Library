import React, { useState, useEffect } from 'react';
import { useSelector } from '../../_hooks';
import { authenticationActions } from '../../_actions';
import { useDispatch } from 'react-redux';
import { history } from '../../_helpers/history';
import styled from 'styled-components';

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
        <Container>
            <Logo>MEDIA LIBRARY</Logo>
            <div>
                {loggedIn ||
                    (user && (
                        <LoginSection>
                            {user && <div>logged in as {user}</div>}
                            <button onClick={handleLogout}>Logout</button>
                        </LoginSection>
                    ))}
            </div>
        </Container>
    );
};

export default Header;

const Container = styled.header`
    width: 100%;
    height: 8vh;
    background-color: ${props => props.theme.colors.primary};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const LoginSection = styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 2vw;
    max-width: 10vw;
`;

const Logo = styled.div`
    color: white;
    font-size: 2em;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bold;
    font-stretch: extra-condensed;
    kerning: 0em;
    margin-left: 2vw;
`;
