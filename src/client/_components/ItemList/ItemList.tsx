import React, { FunctionComponent } from 'react';

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
        if (length > children.length) {
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

    return <ul>{listSection}</ul>;
};
