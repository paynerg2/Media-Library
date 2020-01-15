import styled from 'styled-components';

export const Button = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 5vh;
    width: 20vh;
    border-radius: 2em;
    color: white;
    font-size: 0.8em;
    font-family: ${props => props.theme.fonts.primary};
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 0.6vh;
    padding-left: 0.3vh;
    padding-right: 0.3vh;
    border: solid 2px ${props => props.theme.colors.secondary};
    cursor: pointer;

    & > {
        /*Add text styles here to override things like links */
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
