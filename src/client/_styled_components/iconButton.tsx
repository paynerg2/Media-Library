import styled from 'styled-components';

//! Slight bug: When clicking and not hitting the actual link
//! the user is not redirected.
// todo: replace with just a styled link? No button necessary?

export const IconButton = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 3.5vh;
    width: 3.5vh;
    border-radius: 0.9em;
    margin-bottom: 0.3vh;
    margin-left: 1vh;
    border: solid 2px ${props => props.theme.colors.secondary};
    cursor: pointer;
    color: white;

    & > a {
        /* Remove styles from child elemenets, i.e. Links */
        font-size: 1.5em;
        font-family: ${props => props.theme.fonts.primary};
        text-transform: uppercase;
        font-weight: bold;
        text-decoration: none;
        line-height: 2.9vh;
    }

    &:hover {
        transition: 0.1s ease-in;
        opacity: 0.8;
    }

    &:focus,
    :active:hover,
    :active:focus {
        box-shadow: none;
        outline: 0;
    }
`;
