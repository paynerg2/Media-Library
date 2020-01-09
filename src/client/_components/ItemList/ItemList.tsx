import React, { FunctionComponent, Fragment } from 'react';
import styled from 'styled-components';
import { animated, useTransition } from 'react-spring';

type ItemListProps = {
    items: any[];
    style?: any;
};

export const ItemList: FunctionComponent<ItemListProps> = ({
    items,
    style
}) => {
    const transitions = useTransition(items, item => item.key, {
        from: { transform: 'scale(1)' },
        enter: { transform: 'scale(2)' },
        leave: { transform: 'scale(1)' }
    });

    return (
        <Fragment>
            {style.map((props: any, index: number) => {
                return (
                    <List
                        key={transitions[index].key}
                        style={{ ...props, ...transitions[index] }}
                    >
                        {items[index]}
                    </List>
                );
            })}
        </Fragment>
    );
};

const List = styled(animated.ul)`
    display: flex;
    flex-direction: row;
    padding: 0;
    list-style-type: none;
    margin: 0;
`;
