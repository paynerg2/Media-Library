import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import Book from '../../_components/Book/Book';
import { useSelector } from '../../_hooks';
import { Spinner } from '../../_components/Spinner';

const BookDisplayPage: React.FunctionComponent<BookDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [loading, setLoading] = useState(true);
    const loadingStatus: boolean = useSelector(state => state.books.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    return <Fragment>{loading ? <Spinner /> : <Book id={id} />}</Fragment>;
};

interface BookDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(BookDisplayPage);
