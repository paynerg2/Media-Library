import React, { Fragment, useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useSelector } from '../../_hooks/useSelector';
import { Creator, Book, Disc, Game } from '../../../lib/interfaces';
import { useBooks, useDiscs, useGames } from '../../_hooks';

const CreatorDisplayPage: React.FunctionComponent<CreatorDisplayProps> = props => {
    const { id } = props.match.params;
    const selectedCreator = useSelector(state => state.creators.byId[id]);
    const [creator, setCreator] = useState({} as Creator);
    const books: Book[] = useBooks(id, 'creator');
    const discs: Disc[] = useDiscs(id, 'creator');
    const games: Game[] = useGames(id, 'creator');

    useEffect(() => {
        setCreator(selectedCreator);
    }, [id, selectedCreator]);

    const getFullName = (creator: Creator) => {
        let fullName = creator.firstName;
        if (creator.middleInitials) {
            fullName = `${fullName} ${creator.middleInitials}`;
        }
        if (creator.lastName) {
            fullName = `${fullName} ${creator.lastName}`;
        }
        return fullName;
    };

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

interface CreatorDisplayProps extends RouteComponentProps<{ id: string }> {}

export default withRouter(CreatorDisplayPage);
