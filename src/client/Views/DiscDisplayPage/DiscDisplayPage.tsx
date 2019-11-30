import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_helpers/useSelector';
import { Disc } from '../../../lib/interfaces';

const DiscDisplayPage: React.FunctionComponent<DiscDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [disc, setDisc] = useState({} as Disc);
    const selectedDisc = useSelector(state => state.discs.byId[id]);
    useEffect(() => {
        setDisc(selectedDisc);
    }, [id]);

    return (
        <Fragment>
            <div>{disc.title}</div>
            <div>{id}</div>
        </Fragment>
    );
};

interface DiscDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(DiscDisplayPage);
