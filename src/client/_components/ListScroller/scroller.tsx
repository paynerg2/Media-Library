import React from 'react';
import styled from 'styled-components';

export const Scroller = (props: any) => {
    return (
        <Container disabled={props.disabled} onClick={props.onClick}>
            <DirectionIndicator right={props.right} />
        </Container>
    );
};

const Container = styled.button`
    height: ${props => props.theme.itemHeight};
    width: 4vh;
    background-color: rgba(40, 40, 40, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2%;
    border: none;
    outline: none;

    &:hover > div {
        border-right: 10px solid black;
    }
`;

const DirectionIndicator = styled('div')<{ right: boolean }>`
    width: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid darkgrey;
    border-bottom: 10px solid transparent;

    transform: ${props => (props.right ? 'rotate(180deg)' : 'none')};
`;
