import React from 'react';
import styled from 'styled-components';

import { icons } from '../../_assets/icons';
import { Icon } from '../../_styled_components/displayPage';

const Footer: React.FC = () => {
    return (
        <Container>
            <div>
                <GithubLink>
                    <Icon src={icons.github}></Icon>{' '}
                    <Link
                        href="github.com/paynerg2"
                        style={{ fontSize: '1.2em', color: 'white' }}
                    >
                        paynerg2
                    </Link>
                </GithubLink>
                <span>
                    <Link href="https://github.com/paynerg2/Media-Library">
                        View Source Code
                    </Link>
                </span>
            </div>
            <div>
                <h3>Icons Courtesy of</h3>
                <Icons>
                    <span>
                        <Link href="https://icons8.com">Icons8</Link>
                    </span>
                    <span>
                        Icons made by{' '}
                        <Link
                            href="https://www.flaticon.com/authors/freepik"
                            title="Freepik"
                        >
                            Freepik
                        </Link>
                        {', '}
                        <Link
                            href="https://www.flaticon.com/authors/dmitri13"
                            title="dmitri13"
                        >
                            dmitri13
                        </Link>
                        {', '}
                        <Link
                            href="https://www.flaticon.com/authors/dave-gandy"
                            title="Dave Gandy"
                        >
                            Dave Gandy
                        </Link>{' '}
                        from{' '}
                        <Link href="https://www.flaticon.com/" title="Flaticon">
                            www.flaticon.com
                        </Link>
                    </span>
                </Icons>
            </div>
        </Container>
    );
};

export default Footer;

const Container = styled.footer`
    max-width: 100vw;
    height: 24vh;
    background-color: ${props => props.theme.colors.secondary};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: ${props => props.theme.colors.contrastText};
    opacity: 0.6;
    padding: 5vh 10vw;

    & > {
        font-family: ${props => props.theme.fonts.primary};
    }
`;

const Icons = styled.div`
    display: flex;
    flex-direction: column;
`;

const Link = styled.a`
    text-decoration: none;

    font-size: 1em;
    color: ${props => props.theme.colors.primary};
`;

const GithubLink = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1vh;
`;
