import styled from 'styled-components';

export const EntryModal = styled.div`
    width: 20vw;
    height: auto;
    display: flex;
    position: fixed;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1vh;
    color: ${props => props.theme.colors.contrastText};
    opacity: 0.95;
    font-size: 1.4em;
    background-color: ${props => props.theme.colors.secondary};
    font-family: ${props => props.theme.fonts.primary};
    border-radius: 0.4em;
    z-index: 9999;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: ${props => props.theme.colors.secondary};
        border-top: 0;
        margin-left: -10px;
        margin-top: -10px;
    }
`;
