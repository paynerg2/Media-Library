import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Game from '../../_components/Game/Game';
import { useSelector } from '../../_hooks';

const GameDisplayPage: React.FunctionComponent<GameDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.games.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    return (
        <Fragment>
            {loading ? <div>Loading...</div> : <Game id={id} />}
        </Fragment>
    );
};

interface GameDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(GameDisplayPage);
