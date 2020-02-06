import styled from 'styled-components';

export const Title = styled.div`
    grid-area: title;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 2vh;
    padding-bottom: 2vh;
    padding-left: 2vw;
    padding-right: 3vw;

    width: auto;
    background: ${props => props.theme.colors.secondary};
    border-top-right-radius: 8px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.5em;
    font-weight: bold;
`;

export const Image = styled.img`
    height: auto;
    width: 100%;
    background: ${props => props.theme.colors.secondary};
`;

export const CoverImage = styled(Image)`
    grid-area: cover;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
`;

export const Label = styled.div`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8em;
    letter-spacing: 0.1em;
    height: 3vh;
    width: auto;
    padding-left: 2vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: rgba(0, 0, 0, 0.5);
`;

export const Staff = styled.div`
    grid-area: staff;

    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Entry = styled.div`
    height: 7vh;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 2vh;
    color: #222;
    opacity: 0.8;
    font-size: 1.4em;
    background-color: #efefef;
    font-family: ${props => props.theme.fonts.primary};

    &::after {
        content: ' ';
        display: block;
        border: 0.2vh solid ${props => props.theme.colors.primary};
        min-width: 70%;
        opacity: 0.5;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }

    &:hover::after {
        transition: 0.5s ease-out;
        opacity: 0.8;
    }
`;

export const Details = styled.div`
    grid-area: details;
    width: 100%;

    display: flex;
    flex-direction: column;
`;

export const Icons = styled.div`
    grid-area: icons;
    width: auto;
    padding: 1vh 2vh;

    display: flex;
    flex-direction: row;
    align-items: flex-end;
`;

export const Icon = styled.img`
    height: 5vh;
    width: auto;
    margin-right: 0.5vw;
`;

export const Buttons = styled.div`
    grid-area: buttons;

    display: flex;
    align-items: flex-end;
    padding: 1vh;

    & > button {
        width: 48%;
        border-radius: 0.5em;
        margin: 2px;
    }
`;
