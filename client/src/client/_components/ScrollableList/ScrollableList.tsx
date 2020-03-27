import React, { useRef, useState, Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { SnapList, SnapItem, useScroll } from 'react-snaplist-carousel';
import { WindowSizeObject } from '../../_interfaces';
import { useWindowSize } from '../../_hooks';
import { Scroller } from '../Scroller/';

export const ScrollableList: React.FC = ({ children }) => {
    const listRef = useRef(null);
    const size: WindowSizeObject = useWindowSize();
    const calculateLength = (): number => {
        const ratio =
            size.width && size.height ? size.height / size.width : undefined;
        let length = 1;
        while (!!ratio && 12 + (length + 1) * 21 * ratio < 75) {
            length++;
        }
        return length;
    };
    const minOffset = 0;
    const visibleListLength: number = calculateLength();
    const listLength: number =
        (Array.isArray(children) && children.length) || 0;
    const maxOffset =
        listLength < visibleListLength ? 0 : listLength - visibleListLength + 1;

    const [offset, setOffset] = useState(0);

    const goToSnapItem = useScroll({ ref: listRef });

    const handleIncrement = () => {
        setOffset(Math.min(offset + 1, maxOffset));
    };

    const handleDecrement = () => {
        setOffset(Math.max(offset - 1, minOffset));
    };

    useEffect(() => {
        goToSnapItem(offset);
    }, [offset]);

    return (
        <Fragment>
            {/* Apply scroll inc/dec only when the list length extends past the allotted space */}
            {listLength > visibleListLength ? (
                <Container>
                    <Scroller
                        disabled={offset === minOffset}
                        onClick={handleDecrement}
                    >
                        dec
                    </Scroller>
                    <SnapList width="100%" ref={listRef} direction="horizontal">
                        {Array.isArray(children) &&
                            children.map(e => (
                                <SnapItem snapAlign="start">{e}</SnapItem>
                            ))}
                    </SnapList>
                    <Scroller
                        disabled={offset === maxOffset}
                        onClick={handleIncrement}
                        right
                    >
                        inc
                    </Scroller>
                </Container>
            ) : (
                <Container>
                    <SnapList width="100%" ref={listRef} direction="horizontal">
                        {Array.isArray(children) &&
                            children.map(e => (
                                <SnapItem snapAlign="start">{e}</SnapItem>
                            ))}
                    </SnapList>
                </Container>
            )}
        </Fragment>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 68vw;
    overflow: hidden;
    margin-bottom: 3vh;

    @media (max-width: 768px) {
        max-width: 98%;
    }
`;
