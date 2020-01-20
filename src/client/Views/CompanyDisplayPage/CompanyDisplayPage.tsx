import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import ItemContainer from '../../_components/ItemContainer/ItemContainer';
import { useSelector } from '../../_hooks/useSelector';
import { Company, Book, Disc, Game } from '../../../lib/interfaces';
import { MongoId } from '../../_interfaces';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { ItemList } from '../../_components/ItemList';

const CompanyDisplayPage: React.FunctionComponent<CompanyDisplayPageProps> = props => {
    const { id } = props.match.params;
    const selectedCompany = useSelector(state => state.companies.byId[id]);
    const [company, setCompany] = useState({} as Company);
    const books: (Book & MongoId)[] = useSelector(state =>
        state.books.allIds
            .map(id => state.books.byId[id])
            .filter(
                book =>
                    book.publisher && book.publisher === selectedCompany.name
            )
    );
    const discs: (Disc & MongoId)[] = useSelector(state =>
        state.discs.allIds
            .map(id => state.discs.byId[id])
            .filter(
                disc =>
                    (disc.publisher &&
                        disc.publisher === selectedCompany.name) ||
                    (disc.studio && disc.studio === selectedCompany.name)
            )
    );
    const games: (Game & MongoId)[] = useSelector(state =>
        state.games.allIds
            .map(id => state.games.byId[id])
            .filter(
                game =>
                    game.publisher && game.publisher === selectedCompany.name
            )
    );

    useEffect(() => {
        setCompany(selectedCompany);
    }, [id, selectedCompany]);

    return (
        <Fragment>
            {company && <DisplayHeader>{company.name}</DisplayHeader>}
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
            {games.length > 0 && (
                <Fragment>
                    <SectionHeader>Games</SectionHeader>
                    <ItemList
                        items={games
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(game => (
                                <ItemContainer
                                    key={game._id}
                                    id={game._id}
                                    item={game}
                                    route={'games'}
                                />
                            ))}
                        ref={null}
                    />
                </Fragment>
            )}
        </Fragment>
    );
};

interface CompanyDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(CompanyDisplayPage);
