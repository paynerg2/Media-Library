import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Game from '../../_components/Game/Game';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../_hooks';
import { gameActions } from '../../_actions';

const GameDisplayPage: React.FunctionComponent<GameDisplayPageProps> = props => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.games.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    const handleEdit = () => {
        props.history.push(`/games/edit/${id}`);
    };

    const handleDelete = () => {
        dispatch(gameActions.delete(id));
        //props.history.push('/');
    };

    console.log(loading);

    return (
        <Fragment>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Fragment>
                    <Game id={id} />
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </Fragment>
            )}
        </Fragment>
    );
};

interface GameDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(GameDisplayPage);
