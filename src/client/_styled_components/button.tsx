import styled from 'styled-components';

export const Button = styled.button`
    background-color: ${props => props.theme.colors.secondary};
    border: none;
    height: 8vh;
    width: 20vh;
    border-radius: 2%;
    color: white;
    font-size: 1.2em;
    font-family: ${props => props.theme.fonts.secondary};
    text-transform: uppercase;
    font-weight: bold;

    margin-left: 2vw;
`;
