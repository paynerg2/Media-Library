import React, { FunctionComponent, useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import Scroller from './scroller';
import { ItemList } from '../../_components/ItemList/ItemList';

type ListScrollerProps = {
    style: any;
    list: any[];
    listRef: any;
    length: number;
};

export const ListScroller: FunctionComponent<ListScrollerProps> = ({
    style,
    list,
    listRef,
    length
}) => {
    const [offset, setOffset] = useState(0);
    const [listSection, setListSection] = useState([] as any[]);

    useEffect(() => {
        if (list.length === length) {
            setOffset(0);
        }
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
            {/* Only displays scrollers if necessary */}
            {list.length === listSection.length ? (
                <ItemList ref={listRef} items={listSection} />
            ) : (
                <Fragment>
                    <Scroller
                        style={style}
                        disabled={offset === 0}
                        onClick={decOffset}
                    />
                    <ItemList ref={listRef} items={listSection} />
                    <Scroller
                        style={style}
                        disabled={offset >= list.length - length}
                        onClick={incOffset}
                        right
                    />
                </Fragment>
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;
