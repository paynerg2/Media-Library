import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import Book from '../../_components/Book/Book';
import { useSelector } from '../../_hooks';
import { bookActions } from '../../_actions';

const BookDisplayPage: React.FunctionComponent<BookDisplayPageProps> = props => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const loadingStatus = useSelector(state => state.books.loading);

    useEffect(() => {
        setLoading(loadingStatus);
    }, [loadingStatus]);

    const handleEdit = () => {
        props.history.push(`/books/edit/${id}`);
    };

    const handleDelete = () => {
        dispatch(bookActions.delete(id));
    };

    return (
        <Fragment>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Fragment>
                    <Book id={id} />
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </Fragment>
            )}
        </Fragment>
    );
};

interface BookDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(BookDisplayPage);
