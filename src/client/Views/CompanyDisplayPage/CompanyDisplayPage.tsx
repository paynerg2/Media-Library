import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { ItemContainer } from '../../_components/ItemContainer';
import { ItemList } from '../../_components/ItemList';
import { useSelector } from '../../_hooks/useSelector';
import { Company, Book, Disc, Game } from '../../../lib/interfaces';
import { MongoId } from '../../_interfaces';

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
            <div>{company.name}</div>
            <div>WORKS</div>
            {books.length > 0 && (
                <div>
                    <div>Books</div>
                    <ul>
                        {books
                            .sort((a, b) =>
                                b.title
                                    .toLowerCase()
                                    .localeCompare(a.title.toLowerCase())
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
                                b.title
                                    .toLowerCase()
                                    .localeCompare(a.title.toLowerCase())
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
            {games.length > 0 && (
                <div>
                    <div>Games</div>
                    <ul>
                        {games
                            .sort((a, b) =>
                                b.title
                                    .toLowerCase()
                                    .localeCompare(a.title.toLowerCase())
                            )
                            .map(game => (
                                <ItemContainer
                                    key={game._id}
                                    id={game._id}
                                    item={game}
                                    route={'games'}
                                />
                            ))}
                    </ul>
                </div>
            )}
        </Fragment>
    );
};

interface CompanyDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(CompanyDisplayPage);
