import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Link from '../../_styled_components/link';
import { Item } from '../../../lib/interfaces';

type ItemContainerProps = {
    id: string;
    route: string;
    item: any & Item;
};

const ItemContainer: FunctionComponent<ItemContainerProps> = ({
    route,
    id,
    item
}) => {
    const itemDetailPage: string = `/${route}/${id}`;

    return (
        <ListItem>
            <Link to={itemDetailPage}>
                <Container>
                    {item.image && (
                        <Image src={item.image} alt={`${item.title} Cover`} />
                    )}
                </Container>
            </Link>
        </ListItem>
    );
};

export default ItemContainer;

/*Styles */
const ListItem = styled.li`
    width: ${props => props.theme.itemWidth};
    height: ${props => props.theme.itemHeight};
    list-style-type: none;
    padding: 0;
    margin-left: 1vh;
    margin-right: 1vh;
`;

const Image = styled.img`
    object-fit: cover;
    min-width: 100%;
    height: 100%;
`;

const Container = styled.div`
    display: flex;
    overflow: hidden;
    height: 100%;
    width: 100%;
    border-radius: 2%;
`;
