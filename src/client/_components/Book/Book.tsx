import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { useBook } from '../../_hooks';
import { Book as IBook } from '../../../lib/interfaces';
import Link from '../../_styled_components/link';
import { Button } from '../../_styled_components/button';
import { getFullName } from '../../_helpers/getFullName';
import PhysicalIcon from '../../_assets/icons/book-icon-139.png';
import { BookIcons } from '../../_assets/icons';

import { bookActions } from '../../_actions';
import {
    Title,
    CoverImage,
    Label,
    Staff,
    Entry,
    Details,
    Icons,
    Icon,
    Buttons
} from '../../_styled_components/displayPage';

interface BookProps extends RouteComponentProps {
    id: string;
}

const Book: React.FunctionComponent<BookProps> = props => {
    const { id } = props;
    const [book, setBook] = useState({} as IBook);
    const dispatch = useDispatch();
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

    const handleEdit = () => {
        props.history.push(`/books/edit/${id}`);
    };

    const handleDelete = () => {
        dispatch(bookActions.delete(id));
        props.history.push('/');
    };

    return (
        <Container>
            <Title>
                {series && (
                    <Link to={`../series/${series._id}`}>{book.series}</Link>
                )}
                {book.volume && <div>{book.volume}</div>}
            </Title>
            <Staff>
                <Entry>
                    {authors.map(author => (
                        <Link key={author._id} to={`../creators/${author._id}`}>
                            {getFullName(author)}
                        </Link>
                    ))}
                </Entry>
                <Label>
                    {book.authors && book.authors.length > 1
                        ? 'Authors'
                        : 'Author'}
                </Label>

                <Entry>
                    {artists &&
                        artists.map(artist => (
                            <Link
                                key={artist._id}
                                to={`../creators/${artist._id}`}
                            >
                                {getFullName(artist)}
                            </Link>
                        ))}
                </Entry>
                <Label>
                    {artists && artists.length ? (
                        <div>{artists.length > 1 ? 'Artists' : 'Artist'}</div>
                    ) : null}
                </Label>
                {colorers && !!colorers.length && (
                    <Fragment>
                        <Entry>
                            {colorers &&
                                colorers.map(colorer => (
                                    <Link
                                        key={colorer._id}
                                        to={`../creators/${colorer._id}`}
                                    >
                                        {getFullName(colorer)}
                                    </Link>
                                ))}
                        </Entry>
                        <Label>
                            {colorers && colorers.length ? (
                                <div>
                                    {colorers.length > 1
                                        ? 'Colorers'
                                        : 'Colorer'}
                                </div>
                            ) : null}
                        </Label>
                    </Fragment>
                )}
                {letterers && !!letterers.length && (
                    <Fragment>
                        <Entry>
                            {letterers &&
                                letterers.map(letterer => (
                                    <Link
                                        key={letterer._id}
                                        to={`../creators/${letterer._id}`}
                                    >
                                        {getFullName(letterer)}
                                    </Link>
                                ))}
                        </Entry>
                        <Label>
                            {letterers && letterers.length ? (
                                <div>
                                    {letterers.length > 1
                                        ? 'Letterers'
                                        : 'Letterer'}
                                </div>
                            ) : null}
                        </Label>
                    </Fragment>
                )}
            </Staff>
            <Details>
                {/* {book.listPrice ? (
                    <Price>
                        <div>{book.listPrice}</div>
                    </Price>
                ) : null} */}
                {/* <div>{`${book.language} ${book.type}`}</div> */}
                {publisher && (
                    <Fragment>
                        <Entry>
                            <Link to={`../companies/${publisher._id}`}>
                                {book.publisher}
                            </Link>
                        </Entry>
                        <Label>publisher</Label>
                    </Fragment>
                )}
                {book.location ? (
                    <Fragment>
                        <Entry>{book.location.toUpperCase()}</Entry>
                        <Label>location</Label>
                    </Fragment>
                ) : null}
            </Details>
            <Icons>
                {book.physical && (
                    <Icon
                        src={BookIcons.physical}
                        alt={'Physical Copy Available'}
                    />
                )}
                {book.digital && (
                    <Icon
                        src={BookIcons.digital}
                        alt={'Digital Copy Available'}
                    />
                )}
            </Icons>
            {book.image ? (
                <CoverImage src={book.image} alt={`${book.title} Cover`} />
            ) : null}

            <Buttons>
                <Button onClick={handleEdit}>EDIT</Button>
                <Button onClick={handleDelete}>DELETE</Button>
            </Buttons>
        </Container>
    );
};

export default withRouter(Book);

const Container = styled.div`
    display: grid;
    font-family: Arial, Helvetica, sans-serif;
    background: #efefef;
    margin: 5vh auto;

    grid-template-areas:
        'cover title title'
        'cover staff staff'
        'cover staff staff'
        'cover staff staff'
        'cover staff staff'
        'cover details details'
        'cover details details'
        'cover icons buttons';

    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: min-content 1fr 1fr 1fr 1fr 1fr 1fr min-content;

    /* //todo: height auto is what's causing the image shrink */
    height: auto;
    max-width: calc(min(100%, 768px));
    grid-row-gap: 0px;
    grid-column-gap: 0px;
    border-radius: 8px;
    @media (max-width: 768px) {
        /* Responsive layouthere */
    }
`;
