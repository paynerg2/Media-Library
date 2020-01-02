import React, {
    FunctionComponent,
    Fragment,
    useState,
    ReactElement
} from 'react';
import { Scroller } from './scroller';
import styled from 'styled-components';

type ListScrollerProps = {};

export const ListScroller: FunctionComponent<ListScrollerProps> = ({
    children
}) => {
    const [offset, setOffset] = useState(0);

    const incOffset = () => {
        setOffset(prev => prev + 1);
    };
    const decOffset = () => {
        setOffset(prev => prev - 1);
    };

    return (
        <Container>
            <Scroller disabled={offset === 0} onClick={decOffset} />
            {React.cloneElement(children as ReactElement, { offset: offset })}
            <Scroller onClick={incOffset} right />
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;
