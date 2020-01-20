import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { animated, config, useTransition } from 'react-spring';

type ItemListProps = {
    items: any[];
    ref: any;
    style?: any;
};

export const ItemList: FunctionComponent<ItemListProps> = ({ items, ref }) => {
    const transitions = useTransition(items, item => item.key, {
        ref: ref,
        trail: 40,
        initial: { marginLeft: '-10vh', opacity: 0, maxWidth: '0%' },
        from: { opacity: 0, maxWidth: '0%' },
        enter: { marginLeft: '0vh', opacity: 1, maxWidth: '100%' },
        leave: { opacity: 0, maxWidth: '0%' },
        // @ts-ignore
        config: config.default
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
