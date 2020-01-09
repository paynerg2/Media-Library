import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import Scroller from './scroller';
import { ItemList } from '../../_components/ItemList/ItemList';

type ListScrollerProps = {
    style: any;
    list: any[];
    listStyle: any;
    length: number;
};

export const ListScroller: FunctionComponent<ListScrollerProps> = ({
    style,
    list,
    listStyle,
    length
}) => {
    const [offset, setOffset] = useState(0);
    const [listSection, setListSection] = useState([] as any[]);

    useEffect(() => {
        setListSection(list.slice(offset, offset + length));
    }, [list, offset, length]);

    const incOffset = () => {
        setOffset(prev => prev + 1);
    };
    const decOffset = () => {
        setOffset(prev => prev - 1);
    };

    return (
        <Container>
            <Scroller
                style={style}
                disabled={offset === 0}
                onClick={decOffset}
            />
            <ItemList style={listStyle} items={listSection} />
            <Scroller
                style={style}
                disabled={offset >= list.length - length}
                onClick={incOffset}
                right
            />
        </Container>
    );
};

const Container = styled.div`
    margin: 2vw;
    display: flex;
    flex-direction: row;
`;
