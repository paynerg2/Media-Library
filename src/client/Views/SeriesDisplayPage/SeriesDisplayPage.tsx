import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks/useSelector';
import { Series, Book, Disc, Game } from '../../../lib/interfaces';
import { useBooks, useDiscs, useGames } from '../../_hooks';

const SeriesDisplayPage: React.FunctionComponent<SeriesDisplayPageProps> = props => {
    const { id } = props.match.params;
    const selectedSeries = useSelector(state => state.series.byId[id]);
    const [series, setSeries] = useState({} as Series);
    const books: Book[] = useBooks(id, 'series');
    const discs: Disc[] = useDiscs(id, 'series');
    const games: Game[] = useGames(id, 'series');

    useEffect(() => {
        setSeries(selectedSeries);
    }, [id, selectedSeries]);

    return (
        <Fragment>
            <div>{series.name}</div>
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
                                <li key={book.title}>{book.title}</li>
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
                                <li key={disc.title}>{disc.title}</li>
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
                                <li key={game.title}>{game.title}</li>
                            ))}
                    </ul>
                </div>
            )}
        </Fragment>
    );
};

interface SeriesDisplayPageProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(SeriesDisplayPage);
