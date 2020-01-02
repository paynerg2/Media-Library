import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import Link from '../Link/Link';
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
    const [overlayVisible, setOverlayVisible] = useState(false);
    const props = useSpring({
        background: overlayVisible
            ? 'rgb(0, 153, 255, 0.6)'
            : 'rgb(0, 153, 255, 0)',
        opacity: overlayVisible ? 1 : 0,
        height: overlayVisible ? '10vh' : '0vh'
    });
    const itemDetailPage: string = `/${route}/${id}`;

    return (
        <ListItem>
            <Link to={itemDetailPage}>
                <Container
                    onMouseEnter={() => setOverlayVisible(true)}
                    onMouseLeave={() => setOverlayVisible(false)}
                >
                    {!isCollapsed && item.image && (
                        <Image src={item.image} alt={`${item.title} Cover`} />
                    )}
                    {overlayVisible && (
                        <TextOverlay style={props}>{item.title}</TextOverlay>
                    )}
                </Container>
            </Link>
        </ListItem>
    );
};

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
    box-shadow: 1px 2px 6px 1px darkgrey;
`;

const TextOverlay = styled(animated.div)`
    color: white;
    height: ${props => props.theme.overlayHeight};
    width: ${props => props.theme.itemWidth};
    position: absolute;
    align-self: flex-end;
    background: rgb(0, 153, 255, 0);
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1em;
`;
