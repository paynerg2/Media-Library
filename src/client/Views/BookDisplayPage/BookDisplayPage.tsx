import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_helpers/useSelector';
import { Book } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

const BookDisplayPage: React.FunctionComponent<BookDisplayPageProps> = props => {
    const { id } = props.match.params;
    const [book, setBook] = useState({} as Book);
    const selectedBook = useSelector(state => state.books.byId[id]);
    const useSeriesId = (name: string): string => {
        return useSelector(state => state.series.byTitle[name]);
    };
    useEffect(() => {
        setBook(selectedBook);
    }, [id]);
    console.log('book display page');
    console.log(book);

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
