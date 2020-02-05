import React, { Fragment, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Disc from '../../_components/Disc/Disc';
import { useSelector } from '../../_hooks';

const DiscDisplayPage: React.FunctionComponent<DiscDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.discs.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    return (
        <Fragment>
            {loading ? <div>Loading...</div> : <Disc id={id} />}
        </Fragment>
    );
};

interface DiscDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(DiscDisplayPage);
