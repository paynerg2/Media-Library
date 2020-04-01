import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { useBook } from '../../_hooks';
import { Book as IBook } from '../../../lib/interfaces';
import Link from '../../_styled_components/link';
import { MultipleCreatorEntry } from '../MultipleCreatorEntry/MultipleCreatorEntry';
import { Button, colors } from '../../_styled_components/button';
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
        if (window.confirm(`Are you sure you want to delete ${book.title}?`)) {
            dispatch(bookActions.delete(id));
            props.history.push('/');
        }
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
                {book.authors && <MultipleCreatorEntry creators={authors} />}
                <Label>
                    {book.authors && book.authors.length > 1
                        ? 'Authors'
                        : 'Author'}
                </Label>

                {book.artists && <MultipleCreatorEntry creators={artists} />}
                <Label>
                    {artists && artists.length ? (
                        <div>{artists.length > 1 ? 'Artists' : 'Artist'}</div>
                    ) : null}
                </Label>

                {colorers && !!colorers.length && (
                    <Fragment>
                        <MultipleCreatorEntry creators={colorers} />
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
                        <MultipleCreatorEntry creators={letterers} />
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
                <Button onClick={handleDelete} color={colors.danger}>
                    DELETE
                </Button>
            </Buttons>
        </Container>
    );
};

export default withRouter(Book);

const Container = styled.div`
    display: grid;
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.card};
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

    height: auto;
    max-width: calc(min(100%, 768px));
    grid-row-gap: 0px;
    grid-column-gap: 0px;
    border-radius: 8px;

    @media (max-width: 768px) {
        grid-template-areas:
            'title title'
            'cover cover'
            'staff staff'
            'details details'
            'icons buttons';
        grid-template-columns: 1fr 1fr;
        grid-template-rows: min-content min-content 1fr 1fr min-content;
        margin: 0;
        border-radius: 0;
    }
`;
