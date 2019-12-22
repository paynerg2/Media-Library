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
                {!isCollapsed && item.image && (
                    <img
                        src={item.image}
                        alt={`${item.title} Cover`}
                        height="100"
                    />
                )}
                <div>{item.title}</div>
            </Link>
        </li>
    );
};
