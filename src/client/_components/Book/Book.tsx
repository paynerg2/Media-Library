import React, { Fragment, useState, useEffect } from 'react';
import { useBook } from '../../_hooks';
import { Book as IBook } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';
import { getFullName } from '../../_helpers/getFullName';

interface BookProps {
    id: string;
}

const Book: React.FunctionComponent<BookProps> = props => {
    const { id } = props;
    const [book, setBook] = useState({} as IBook);
    const {
        book: selectedBook,
        authors,
        artists,
        colorers,
        letterers,
        series,
        publisher
    } = useBook(id);

    useEffect(() => {
        setBook(selectedBook);
    }, [selectedBook]);

    return (
        <Fragment>
            <div>{book.title}</div>
            <div>
                {book.authors && book.authors.length > 1 ? 'Authors' : 'Author'}
            </div>
            {authors.map(author => (
                <Link key={author._id} to={`../creators/${author._id}`}>
                    {getFullName(author)}
                </Link>
            ))}
            {artists && artists.length ? (
                <div>{artists.length > 1 ? 'Artists' : 'Artist'}</div>
            ) : null}
            {artists &&
                artists.map(artist => (
                    <Link key={artist._id} to={`../creators/${artist._id}`}>
                        {getFullName(artist)}
                    </Link>
                ))}

            {colorers && colorers.length ? (
                <div>{colorers.length > 1 ? 'Colorers' : 'Colorer'}</div>
            ) : null}
            {colorers &&
                colorers.map(colorer => (
                    <Link key={colorer._id} to={`../creators/${colorer._id}`}>
                        {getFullName(colorer)}
                    </Link>
                ))}

            {letterers && letterers.length ? (
                <div>{letterers.length > 1 ? 'Letterers' : 'Letterer'}</div>
            ) : null}
            {letterers &&
                letterers.map(letterer => (
                    <Link key={letterer._id} to={`../creators/${letterer._id}`}>
                        {getFullName(letterer)}
                    </Link>
                ))}

            {publisher && (
                <div>
                    <div>Publisher:</div>
                    <Link to={`../companies/${publisher._id}`}>
                        {book.publisher}
                    </Link>
                </div>
            )}
            {series && (
                <div>
                    <div>Series:</div>
                    <Link to={`../series/${series._id}`}>{book.series}</Link>
                </div>
            )}
            {book.volume ? <div>{`volume ${book.volume}`}</div> : null}
            <div>{`${book.language} language ${book.type}`}</div>
            {book.listPrice ? (
                <Fragment>
                    <div>List Price:</div>
                    <div>{book.listPrice}</div>
                </Fragment>
            ) : null}
            {book.location ? (
                <div>{`This item can be found in ${book.location}`}</div>
            ) : null}
            {book.physical && <div>Physical Copy Available</div>}
            {book.digital && <div>Digital Copy Available</div>}
            {book.isbn ? <div>{`ISBN: ${book.isbn}`}</div> : null}
        </Fragment>
    );
};

export default Book;
