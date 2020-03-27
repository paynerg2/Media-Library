import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks/useSelector';
import { Series, Book, Disc, Game } from '../../../lib/interfaces';
import { MongoId } from '../../_interfaces';
import ItemContainer from '../../_components/ItemContainer/ItemContainer';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { ScrollableList } from '../../_components/ScrollableList';

const SeriesDisplayPage: React.FunctionComponent<SeriesDisplayPageProps> = props => {
    const { id } = props.match.params;
    const selectedSeries = useSelector(state => state.series.byId[id]);
    const [series, setSeries] = useState({} as Series);
    const books: (Book & MongoId)[] = useSelector(state =>
        state.books.allIds
            .map(id => state.books.byId[id])
            .filter(book => book.series === selectedSeries.name)
    );
    const discs: (Disc & MongoId)[] = useSelector(state =>
        state.discs.allIds
            .map(id => state.discs.byId[id])
            .filter(disc => disc.series === selectedSeries.name)
    );
    const games: (Game & MongoId)[] = useSelector(state =>
        state.games.allIds
            .map(id => state.games.byId[id])
            .filter(game => game.series === selectedSeries.name)
    );

    useEffect(() => {
        setSeries(selectedSeries);
    }, [id, selectedSeries]);

    return (
        <Fragment>
            {series && <DisplayHeader>{series.name}</DisplayHeader>}
            {books.length > 0 && (
                <Fragment>
                    <SectionHeader>Books</SectionHeader>
                    <ScrollableList>
                        {books
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(book => (
                                <ItemContainer
                                    id={book._id}
                                    key={book._id}
                                    item={book}
                                    route={'books'}
                                />
                            ))}
                    </ScrollableList>
                </Fragment>
            )}
            {discs.length > 0 && (
                <Fragment>
                    <SectionHeader>Discs</SectionHeader>
                    <ScrollableList>
                        {discs
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(disc => (
                                <ItemContainer
                                    id={disc._id}
                                    key={disc._id}
                                    item={disc}
                                    route={'discs'}
                                />
                            ))}
                    </ScrollableList>
                    >
                </Fragment>
            )}
            {games.length > 0 && (
                <Fragment>
                    <SectionHeader>Games</SectionHeader>
                    <ScrollableList>
                        {games
                            .sort((a, b) =>
                                a.title
                                    .toLowerCase()
                                    .localeCompare(b.title.toLowerCase())
                            )
                            .map(game => (
                                <ItemContainer
                                    id={game._id}
                                    key={game._id}
                                    item={game}
                                    route={'games'}
                                />
                            ))}
                    </ScrollableList>
                </Fragment>
            )}
        </Fragment>
    );
};

interface SeriesDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(SeriesDisplayPage);
