import styled from 'styled-components';

export const DisplayHeader = styled.h1`
    min-height: 8vh;
    max-height: auto;

    margin: 1vh 0vh;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: ${props => props.theme.fonts.primary};
    color: ${props => props.theme.colors.contrastText};
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.2em;

    background: ${props => props.theme.colors.primary};
    border-radius: 0.2em;
    opacity: 0.6;

    @media (max-width: 768px) {
        border-radius: 0;
        margin: 0;
    }
`;
