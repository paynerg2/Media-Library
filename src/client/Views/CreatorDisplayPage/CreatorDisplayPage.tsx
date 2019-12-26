import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks/useSelector';
import { Creator, Book, Disc } from '../../../lib/interfaces';
import { getFullName } from '../../_helpers/getFullName';
import { ItemContainer } from '../../_components/ItemContainer';
import { MongoId } from '../../_interfaces';

const CreatorDisplayPage: React.FunctionComponent<CreatorDisplayProps> = props => {
    const { id } = props.match.params;
    const selectedCreator = useSelector(state => state.creators.byId[id]);
    const fullName = getFullName(selectedCreator);
    const [creator, setCreator] = useState({} as Creator);
    const books: (Book & MongoId)[] = useSelector(state =>
        state.books.allIds
            .map(id => state.books.byId[id])
            .filter(
                book =>
                    book.authors.includes(fullName) ||
                    (book.artists && book.artists.includes(fullName)) ||
                    (book.colorer && book.colorer.includes(fullName)) ||
                    (book.letterer && book.letterer.includes(fullName))
            )
    );
    const discs: (Disc & MongoId)[] = useSelector(state =>
        state.discs.allIds
            .map(id => state.discs.byId[id])
            .filter(disc => disc.director === fullName)
    );

    useEffect(() => {
        setCreator(selectedCreator);
    }, [id, selectedCreator]);

    //TODO: Extract most of the mapping to reusable component
    return (
        <Fragment>
            <div>{getFullName(creator)}</div>
            <div>WORKS</div>
            {books.length > 0 && (
                <div>
                    <div>Books</div>
                    <ul>
                        {books
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(book => (
                                <ItemContainer
                                    key={book._id}
                                    id={book._id}
                                    item={book}
                                    route={'books'}
                                />
                            ))}
                    </ul>
                </div>
            )}
            {discs.length > 0 && (
                <div>
                    <div>Discs</div>
                    <ul>
                        {discs
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(disc => (
                                <ItemContainer
                                    key={disc._id}
                                    id={disc._id}
                                    item={disc}
                                    route={'discs'}
                                />
                            ))}
                    </ul>
                </div>
            )}
        </Fragment>
    );
};

interface CreatorDisplayProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(CreatorDisplayPage);
