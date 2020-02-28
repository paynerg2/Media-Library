import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring } from 'react-spring';

import { useSelector } from '../../_hooks';
import Link from '../../_styled_components/link';
import { SearchBar } from '../../_components/SearchBar';
import { SubMenu } from '../SubMenu';
import { icons } from '../../_assets/icons';
import { Icon } from '../../_styled_components/displayPage';

interface HeaderProps {
    toggleTheme: () => void;
}

const Header: React.FunctionComponent<HeaderProps> = ({ toggleTheme }) => {
    const { loggedIn } = useSelector(state => state.authentication);

    const [showMenu, setShowMenu] = useState(false);

    const handleLeave = () => {
        setShowMenu(false);
    };

    const handleClick = () => {
        setShowMenu(true);
    };

    return (
        <Container>
            <Logo to="/">MEDIA LIBRARY</Logo>

            <LoginSection>
                <SearchBar />
                {/* {loggedIn ||
                    (user && <Button onClick={handleLogout}>Logout</Button>)} */}
                <div onMouseLeave={handleLeave} onClick={handleClick}>
                    <Menu>
                        <Icon src={icons.settings} alt="Settings" />
                    </Menu>
                    {showMenu && <SubMenu toggleTheme={toggleTheme} />}
                </div>
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
    align-items: center;
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

const Menu = styled.div`
    height: 8vh;
    width: 10vw;
    font-family: ${props => props.theme.fonts.primary};
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        opacity: 0.8;
        transition: 0.4s linear;
    }
`;
