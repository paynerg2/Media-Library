//@ts-nocheck

import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { animated, config, useTransition } from 'react-spring';

type ItemListProps = {
    items: any[];
    ref: any;
    style?: any;
};

export const ItemList: FunctionComponent<ItemListProps> = ({ items, ref }) => {
    /**
     * Config arrow function is a stop-gap to prevent this issue:
     * https://github.com/react-spring/react-spring/issues/522
     * ts-nocheck at the top of the file prevents a Typecheck error
     * which occurs when this arrow function is used, but not otherwise.
     * TODO: Find a way to implement this without disabling type checking for the whole component.
     */
    const transitions = useTransition(items, item => item.key, {
        ref: ref,
        trail: 20,
        initial: { marginLeft: '-10vh', opacity: 0, maxWidth: '0%' },
        from: { marginLeft: '0vh', opacity: 0, maxWidth: '0%' },
        enter: { marginLeft: '0vh', opacity: 1, maxWidth: '100%' },
        leave: {
            marginLeft: '0vh',
            opacity: 0,
            maxWidth: '0vh'
        },
        config: (item, state) =>
            state === 'leave' ? { duration: 0 } : config.default
    });

    return (
        <Container>
            {transitions.map(({ props, key, item }) => {
                return (
                    <List key={key} style={props}>
                        {item}
                    </List>
                );
            })}
        </Container>
    );
};

const Container = styled.ul`
    display: flex;
    flex-direction: row;
    padding: 0;
    margin: 0;
`;

const List = styled(animated.li)`
    list-style-type: none;
`;
