import styled from 'styled-components';

export const IconButton = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 2.2vh;
    width: 2.2vh;
    line-height: 2.2vh;
    text-align: center;
    font-size: 1.2rem;
    font-family: ${props => props.theme.fonts.primary};
    text-transform: uppercase;
    font-weight: bold;
    text-decoration: none;
    color: ${props => props.theme.colors.contrastText};
    border: solid 2px ${props => props.theme.colors.secondary};
    border-radius: 0.5rem;
    margin-left: 1vh;
    margin-bottom: 0.5vh;
    cursor: pointer;
    padding: 0;

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
