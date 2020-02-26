import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { authenticationActions } from '../../_actions';
import { useDispatch } from 'react-redux';
import { history } from '../../_helpers/history';

interface SubMenuProps {
    toggleTheme: () => void;
}

export const SubMenu: React.FunctionComponent<SubMenuProps> = ({
    toggleTheme
}) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState('');

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

    const handleDarkModeToggle = () => {
        toggleTheme();
    };

    return (
        <Menu>
            <Item>Logged in as: {user}</Item>
            <SelectableItem onClick={handleDarkModeToggle}>
                Dark Mode Toggle
            </SelectableItem>

            <Seperator />
            <SelectableItem onClick={handleLogout}>Logout</SelectableItem>
        </Menu>
    );
};

const Menu = styled.div`
    position: absolute;
    justify-content: flex-start;
    color: white;
    background: ${props => props.theme.colors.primary};

    width: 10vw;
    padding: 0 1vw;
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: ${props => props.theme.fonts.primary};
    font-size: 1.2em;
    justify-content: center;

    color: white;
    height: 6vh;
`;

const SelectableItem = styled(Item)`
    &:hover {
        color: ${props => props.theme.colors.secondary};
        cursor: pointer;
    }
`;

const Seperator = styled.div`
    height: 3px;
    width: 100%;
    background: white;
    opacity: 0.6;
`;
