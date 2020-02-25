import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { animated, useTransition } from 'react-spring';
import Link from '../../_styled_components/link';
import { Item } from '../../../lib/interfaces';

type ItemContainerProps = {
    id: string;
    route: string;
    item: any & Item;
    isCollapsed?: boolean;
};

const ItemContainer: FunctionComponent<ItemContainerProps> = ({
    route,
    id,
    item,
    isCollapsed = false
}) => {
    const [overlayVisible, setOverlayVisible] = useState(false);

    const transition = useTransition(overlayVisible, null, {
        from: {
            opacity: 0,
            background: 'rgb(0, 153, 255, 0)',
            height: '0vh'
        },
        enter: {
            opacity: 1,
            background: 'rgb(0, 153, 255, 0.6)',
            height: '10vh'
        },
        leave: { opacity: 0, background: 'rgb(0, 153, 255, 0)', height: '0vh' }
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
                    {transition.map(
                        ({ item: overlay, key, props }) =>
                            overlay && (
                                <TextOverlay key={key} style={props}>
                                    {item.title}
                                </TextOverlay>
                            )
                    )}
                </Container>
            </Link>
        </ListItem>
    );
};

export default animated(ItemContainer);

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
    /* box-shadow: 1px 2px 6px 1px darkgrey; */
`;

const TextOverlay = styled(animated.div)`
    color: ${props => props.theme.colors.contrastText};
    height: ${props => props.theme.overlayHeight};
    width: ${props => props.theme.itemWidth};
    position: absolute;
    align-self: flex-end;
    background: #0099ff;
    text-align: center;
    font-family: ${props => props.theme.fonts.primary};
    font-size: 1em;
`;
