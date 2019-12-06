import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector, useSeriesId } from '../../_hooks';
import { Disc } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

const DiscDisplayPage: React.FunctionComponent<DiscDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [disc, setDisc] = useState({} as Disc);
    const selectedDisc = useSelector(state => state.discs.byId[id]);
    useEffect(() => {
        setDisc(selectedDisc);
    }, [id, selectedDisc]);

    return (
        <Fragment>
            <div>{disc.title}</div>
            <div>{id}</div>
            <Link to={`../series/${useSeriesId(disc.series)}`}>
                {disc.series}
            </Link>
        </Fragment>
    );
};

interface DiscDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(DiscDisplayPage);
