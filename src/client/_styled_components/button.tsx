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
    box-shadow: 1px 2px 6px 1px darkgrey;
    margin-left: 2vw;
    border: solid 2px darkslateblue;

    &:hover {
        transition: 0.1s ease-in;
        transform: scale(1.02);
    }

    &:active:hover,
    :active:focus {
        box-shadow: none;
    }
`;
