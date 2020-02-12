import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from '../../_hooks';
import { authenticationActions, userActions } from '../../_actions';
import { useDispatch } from 'react-redux';
import { history } from '../../_helpers/history';
import { Button } from '../../_styled_components/button';
import Link from '../../_styled_components/link';
import { SearchBar } from '../../_components/SearchBar';

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
            <Logo to="/">MEDIA LIBRARY</Logo>

            <LoginSection>
                <SearchBar />
                {loggedIn ||
                    (user && <Button onClick={handleLogout}>Logout</Button>)}
            </LoginSection>
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
    color: white;
`;

const LoginSection = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 40%;
    margin-right: 2vw;
`;

const Logo = styled(Link)`
    font-size: 2em;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bold;
    font-stretch: extra-condensed;
    kerning: 0em;
    margin-left: 2vw;
`;
