import React, { Fragment, useState, useEffect } from 'react';
import { useGame } from '../../_hooks';
import { Game as IGame } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

interface GameProps {
    id: string;
}

const Game: React.FunctionComponent<GameProps> = props => {
    const { id } = props;
    const [game, setGame] = useState({} as IGame);
    const { game: selectedGame, series, publisher } = useGame(id);
    useEffect(() => {
        setGame(selectedGame);
    }, [selectedGame]);

    return (
        <Fragment>
            <div>{game.title}</div>
            <div>{`Platforms: ${game.platforms &&
                game.platforms.join(', ')}`}</div>
            {game.multiplayer && <div>Multiplayer</div>}
            {game.genre}
            <div>
                {publisher && (
                    <Fragment>
                        <div>Publisher:</div>
                        <Link to={`../companies/${publisher._id}`}>
                            {game.publisher}
                        </Link>
                    </Fragment>
                )}
            </div>
            {series && (
                <Fragment>
                    <Link to={`../series/${series._id}`}>{game.series}</Link>
                </Fragment>
            )}
            <div>{`Languages: ${game.languages &&
                game.languages.join(', ')}`}</div>
            {game.listPrice ? (
                <Fragment>
                    <div>List Price:</div>
                    <div>{game.listPrice}</div>
                </Fragment>
            ) : null}
            {game.location ? (
                <div>{`This item can be found in ${game.location}`}</div>
            ) : null}
            {game.physical && <div>Physical Copy Available</div>}
            {game.digital && <div>Digital Copy Available</div>}
            {game.image ? (
                <img
                    src={game.image}
                    alt={`${game.title} Cover`}
                    height="400"
                />
            ) : null}
        </Fragment>
    );
};

export default Game;
