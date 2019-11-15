import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../../lib/interfaces';

type ItemContainerProps = {
    id: string;
    route: string;
    item: any & Item;
    isCollapsed?: boolean;
};

export const ItemContainer: FunctionComponent<ItemContainerProps> = ({
    route,
    id,
    item,
    isCollapsed = false
}) => {
    const itemDetailPage: string = `/${route}/${id}`;

    return (
        <li>
            <Link to={itemDetailPage}>
                {!isCollapsed && <div>Image Here</div>}
                <div>{item.title}</div>
            </Link>
        </li>
    );
};
