import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Link from '../../_styled_components/link';
import { SearchBar } from '../../_components/SearchBar';
import { SubMenu } from '../SubMenu';
import { icons } from '../../_assets/icons';
import { Icon } from '../../_styled_components/displayPage';
import { WindowSizeObject } from '../../_interfaces';
import { useWindowSize } from '../../_hooks';

interface HeaderProps {
    toggleTheme: () => void;
}

const Header: React.FunctionComponent<HeaderProps> = ({ toggleTheme }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isSearchable, setIsSearchable] = useState(true);
    const location = useLocation();

    const size: WindowSizeObject = useWindowSize();
    const minDesktopScreenSize = 768;
    const isMobileSize = size.width && size.width < minDesktopScreenSize;

    useEffect(() => {
        let isEntityPage =
            location.pathname.includes('login') ||
            location.pathname.includes('register') ||
            location.pathname.includes('books') ||
            location.pathname.includes('discs') ||
            location.pathname.includes('games');
        setIsSearchable(!isEntityPage);
    }, [location, isSearchable]);

    const handleLeave = () => {
        setShowMenu(false);
    };

    const handleClick = () => {
        setShowMenu(true);
    };

    const handleToggle = () => {
        setShowMenu(prev => !prev);
    };

    return isMobileSize ? (
        <Fragment>
            <Container>
                <Logo to="/">MEDIA LIBRARY</Logo>
                <MobileMenu onClick={handleToggle}>Menu</MobileMenu>
            </Container>

            {isSearchable && (
                <Fragment>
                    <Seperator />
                    <SearchMenu>
                        <SearchBar />
                    </SearchMenu>
                </Fragment>
            )}
            {showMenu && <SubMenu toggleTheme={toggleTheme} />}
        </Fragment>
    ) : (
        <Container>
            <Logo to="/">MEDIA LIBRARY</Logo>
            <LoginSection>
                {isSearchable && <SearchBar />}
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

    @media (max-width: 768px) {
        height: 15vh;
    }
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

const MobileMenu = styled.div`
    height: 6vh;
    width: 15vw;
    border: solid 1px ${props => props.theme.colors.contrastText};
    border-radius: 12%;
    margin-right: 2vw;
    line-height: 6vh;
    text-align: center;
`;

const SearchMenu = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 6vh;
    padding: 0.3vh 2vw;
    background-color: ${props => props.theme.colors.primary};
`;

const Seperator = styled.div`
    height: 3px;
    width: 100%;
    background: white;
    opacity: 0.6;
`;
