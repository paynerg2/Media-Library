import styled from 'styled-components';

export const IconButton = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 4vh;
    width: 4vh;
    font-size: 1.5rem;
    font-family: ${props => props.theme.fonts.primary};
    text-transform: uppercase;
    font-weight: bold;
    text-decoration: none;
    color: ${props => props.theme.colors.contrastText};
    border: solid 2px ${props => props.theme.colors.secondary};
    border-radius: 3px;
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

    @media (max-width: 768px) {
        font-size: 0.9rem;
    }
`;
