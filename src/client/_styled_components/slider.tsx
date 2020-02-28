import React from 'react';
import styled from 'styled-components';

interface SliderProps {
    value: boolean;
    onChange: () => void;
}

export const Slider: React.FunctionComponent<SliderProps> = ({
    onChange,
    value
}) => {
    return (
        <Switch>
            <Input type="checkbox" checked={value} onChange={onChange} />
            <Toggle />
        </Switch>
    );
};

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
`;

const Toggle = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 34px;
    transition: 0.4s;

    &::before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 50%;
        transition: 0.4s;
    }
`;

const Input = styled.input`
    opacity: 0;
    height: 0;
    width: 0;

    &:checked + ${Toggle} {
        background-color: ${props => props.theme.colors.secondary};
    }
    &:focus + ${Toggle} {
        box-shadow: 0 0 1px ${props => props.theme.colors.secondary};
    }

    &:checked + ${Toggle}::before {
        transform: translateX(26px);
    }
`;

/** Adapted from https://www.w3schools.com/howto/howto_css_switch.asp */
