import React, { Fragment, useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../_hooks';
import { Game as IGame } from '../../../lib/interfaces';
import Link from '../../_styled_components/link';
import { Button } from '../../_styled_components/button';
import {
    Title,
    CoverImage,
    Label,
    Staff,
    Entry,
    Details,
    Icons,
    Icon,
    Buttons
} from '../../_styled_components/displayPage';
import { useDispatch } from 'react-redux';
import { gameActions } from '../../_actions';
import { GameSystemIcons } from '../../_assets/icons';

interface GameProps extends RouteComponentProps {
    id: string;
}

const Game: React.FunctionComponent<GameProps> = props => {
    const { id } = props;
    const dispatch = useDispatch();
    const [game, setGame] = useState({} as IGame);
    const { game: selectedGame, series, publisher } = useGame(id);
    useEffect(() => {
        setGame(selectedGame);
    }, [selectedGame]);

    const handleEdit = () => {
        props.history.push(`/games/edit/${id}`);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${game.title}?`)) {
            dispatch(gameActions.delete(id));
            props.history.push('/');
        }
    };

    return (
        <Container>
            {game.image ? (
                <CoverImage src={game.image} alt={`${game.title} Cover`} />
            ) : null}

            <Title>
                {series ? (
                    <Link to={`../series/${series._id}`}>{game.title}</Link>
                ) : (
                    <div>{game.title}</div>
                )}
            </Title>

            <Staff>
                {publisher && (
                    <Fragment>
                        <Entry>
                            <Link to={`../companies/${publisher._id}`}>
                                {game.publisher}
                            </Link>
                        </Entry>
                        <Label>Publisher</Label>
                    </Fragment>
                )}
            </Staff>

            <Details>
                {game.genre ? (
                    <Fragment>
                        <Entry>{game.genre}</Entry>
                        <Label>genre</Label>
                    </Fragment>
                ) : null}
                {game.location ? (
                    <Fragment>
                        <Entry>{game.location}</Entry>
                        <Label>Location</Label>
                    </Fragment>
                ) : null}
                {game.languages && game.languages.length && (
                    <Fragment>
                        <Entry>{game.languages.join(', ')}</Entry>
                        <Label>Languages</Label>
                    </Fragment>
                )}
            </Details>

            <Icons>
                {game.multiplayer && (
                    <Icon src={GameSystemIcons.multiplayer} alt="Multiplayer" />
                )}

                {game.platforms &&
                    game.platforms.length &&
                    game.platforms.map((platform: string) => {
                        console.log(platform);
                        const cleanedPlatformName = platform
                            .replace(/[-,_, ]/gi, '')
                            .toLocaleLowerCase();
                        console.log(cleanedPlatformName);
                        return (
                            <Icon
                                key={platform}
                                src={GameSystemIcons[cleanedPlatformName]}
                                alt={platform}
                            />
                        );
                    })}
            </Icons>

            <Buttons>
                <Button onClick={handleEdit}>EDIT</Button>
                <Button onClick={handleDelete}>DELETE</Button>
            </Buttons>
        </Container>
    );
};

export default withRouter(Game);

const Container = styled.div`
    display: grid;
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.card};
    margin: 5vh auto;

    grid-template-areas:
        'cover title title'
        'cover staff staff'
        'cover details details'
        'cover details details'
        'cover icons buttons';

    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: min-content 1fr 1fr 1fr min-content;

    max-height: min-content;
    max-width: calc(min(100%, 768px));
    grid-gap: 0;
    border-radius: 8px;
    @media (max-width: 768px) {
        /* Responsive layouthere */
    }
`;
