import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks/useSelector';
import { Creator, Book, Disc } from '../../../lib/interfaces';
import { getFullName } from '../../_helpers/getFullName';
import ItemContainer from '../../_components/ItemContainer/ItemContainer';
import { MongoId } from '../../_interfaces';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { ItemList } from '../../_components/ItemList';

const CreatorDisplayPage: React.FunctionComponent<CreatorDisplayProps> = props => {
    const { id } = props.match.params;
    const selectedCreator = useSelector(state => state.creators.byId[id]);
    const fullName = selectedCreator ? getFullName(selectedCreator) : '';
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
            {creator && <DisplayHeader>{getFullName(creator)}</DisplayHeader>}
            {books.length > 0 && (
                <Fragment>
                    <SectionHeader>Books</SectionHeader>
                    <ItemList
                        items={books
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
                        ref={null}
                    />
                </Fragment>
            )}
            {discs.length > 0 && (
                <Fragment>
                    <SectionHeader>Discs</SectionHeader>
                    <ItemList
                        items={discs
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
                        ref={null}
                    />
                </Fragment>
            )}
        </Fragment>
    );
};

interface CreatorDisplayProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(CreatorDisplayPage);
