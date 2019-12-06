import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector, useSeriesId } from '../../_hooks';
import { Book } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

const BookDisplayPage: React.FunctionComponent<BookDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [book, setBook] = useState({} as Book);
    const selectedBook = useSelector(state => state.books.byId[id]);

    useEffect(() => {
        setBook(selectedBook);
    }, [id, selectedBook]);

    return (
        <Fragment>
            <div>{book.title}</div>
            <div>{id}</div>
            <Link to={`../series/${useSeriesId(book.series)}`}>
                {book.series}
            </Link>
        </Fragment>
    );
};

interface BookDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(BookDisplayPage);
