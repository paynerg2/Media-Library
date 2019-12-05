import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks';
import { Game } from '../../../lib/interfaces';

const GameDisplayPage: React.FunctionComponent<GameDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [game, setGame] = useState({} as Game);
    const selectedGame = useSelector(state => state.games.byId[id]);
    useEffect(() => {
        setGame(selectedGame);
    }, [id]);

    return (
        <Fragment>
            <div>{game.title}</div>
            <div>{id}</div>
        </Fragment>
    );
};

interface GameDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(GameDisplayPage);
