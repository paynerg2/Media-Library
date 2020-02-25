import styled from 'styled-components';

//! Slight bug: When clicking and not hitting the actual link
//! the user is not redirected.

export const IconButton = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 2.2vh;
    width: 2.2vh;
    border-radius: 0.5rem;
    margin-left: 1vh;
    border: solid 2px ${props => props.theme.colors.secondary};
    cursor: pointer;
    color: ${props => props.theme.colors.contrastText};
    padding: 0;

    & > a {
        /* Remove styles from child elemenets, i.e. Links */
        font-size: 1rem;
        font-family: ${props => props.theme.fonts.primary};
        text-transform: uppercase;
        font-weight: bold;
        text-decoration: none;
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
