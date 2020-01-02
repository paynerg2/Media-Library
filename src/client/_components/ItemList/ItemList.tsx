import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

type ItemListProps = {
    length: number;
    offset?: number;
};

export const ItemList: FunctionComponent<ItemListProps> = ({
    children,
    length,
    offset = 0
}) => {
    let listSection = null;
    if (Array.isArray(children)) {
        if (length > children.length - 1) {
            listSection = children;
        } else {
            // Ensure minimum length of the array
            offset =
                children.length - offset < length
                    ? children.length - length - 1
                    : offset;
            listSection = children.slice(offset, offset + length);
        }
    }

    return <List>{listSection}</List>;
};

const List = styled.ul`
    display: flex;
    flex-direction: row;
    padding: 0;
    list-style-type: none;
    margin: 0;
`;
