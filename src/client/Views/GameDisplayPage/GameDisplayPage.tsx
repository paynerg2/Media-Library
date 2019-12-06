import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector, useSeriesId } from '../../_hooks';
import { Game } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

const GameDisplayPage: React.FunctionComponent<GameDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [game, setGame] = useState({} as Game);
    const selectedGame = useSelector(state => state.games.byId[id]);
    useEffect(() => {
        setGame(selectedGame);
    }, [id, selectedGame]);

    return (
        <Fragment>
            <div>{game.title}</div>
            <div>{id}</div>
            <Link to={`../series/${useSeriesId(game.series)}`}>
                {game.series}
            </Link>
        </Fragment>
    );
};

interface GameDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(GameDisplayPage);
