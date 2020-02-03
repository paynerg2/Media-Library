import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Book from '../../_components/Book/Book';
import { useSelector } from '../../_hooks';

const BookDisplayPage: React.FunctionComponent<BookDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.books.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    return (
        <Fragment>
            {loading ? <div>Loading...</div> : <Book id={id} />}
        </Fragment>
    );
};

interface BookDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(BookDisplayPage);
