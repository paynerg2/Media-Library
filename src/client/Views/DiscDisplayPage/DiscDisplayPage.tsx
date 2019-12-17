import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch } from 'react-redux';
import Disc from '../../_components/Disc/Disc';
import { discActions } from '../../_actions';
import { useSelector } from '../../_hooks';

const DiscDisplayPage: React.FunctionComponent<DiscDisplayPageProps> = props => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.discs.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    const handleEdit = () => {
        props.history.push(`/discs/edit/${id}`);
    };

    const handleDelete = () => {
        dispatch(discActions.delete(id));
    };

    return (
        <Fragment>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Fragment>
                    <Disc id={id} />
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </Fragment>
            )}
        </Fragment>
    );
};

interface DiscDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(DiscDisplayPage);
