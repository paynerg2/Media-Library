import React from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';

const ScrollerComponent = (props: any) => {
    return (
        <Container
            style={props.style}
            disabled={props.disabled}
            onClick={props.onClick}
            right={props.right}
        >
            <DirectionIndicator right={props.right} />
        </Container>
    );
};

export const Scroller = animated(ScrollerComponent);

/* Styles */

const Container = styled(animated.button)<{ right: boolean }>`
    height: ${props => props.theme.itemHeight};
    width: 3vw;
    background-color: rgba(40, 40, 40, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2%;
    border: none;
    outline: none;
    border: solid 1px darkgrey;
    margin-right: ${props => (props.right ? '0vh' : '1vh')};
    margin-left: ${props => (props.right ? '1vh' : '0vh')};
    cursor: pointer;

    &:hover > div {
        border-right: 10px solid black;
        transition: 0.2s ease-in;
    }

    @media (max-width: 768px) {
        display: none;
        width: 0;
    }
`;

const DirectionIndicator = styled('div')<{ right: boolean }>`
    width: 0;
    border-top: 10px solid transparent;
    border-right: 10px solid #8f8f8f;
    border-bottom: 10px solid transparent;

    transform: ${props => (props.right ? 'rotate(180deg)' : 'none')};
`;
