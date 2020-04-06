import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { ScrollableList } from '../../_components/ScrollableList';
import { useSelector } from '../../_hooks';
import { getFilteredList } from '../../_helpers/getFilteredList';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { Button } from '../../_styled_components/button';
import { IconButton } from '../../_styled_components/iconButton';
import Link from '../../_styled_components/link';
import { SearchResultCount } from '../../_styled_components/searchResultCount';

import { Spinner } from '../../_components/Spinner';

//! Redirect from login does not load data

const HomePage: React.FC = () => {
    const searchTerm: string = useSelector(state => state.search.term);
    const { books, discs, games } = useSelector(state => state);

    const bookList: JSX.Element[] = getFilteredList(books, searchTerm, 'books');
    const discList: JSX.Element[] = getFilteredList(discs, searchTerm, 'discs');
    const gameList: JSX.Element[] = getFilteredList(games, searchTerm, 'games');

    const [visibility, setVisibility] = useState([true, true, true]);
    const [singleView, setSingleView] = useState(false);

    const handleVisibilityToggle = (visibility: boolean[]) => {
        singleView
            ? setVisibility([true, true, true])
            : setVisibility(visibility);
        setSingleView(prev => !prev);
    };

    const getButtonText = () => {
        return singleView ? 'Back' : 'View All';
    };

    //! Bug: Clicking View All while offset != 0 does not show entire list

    return (
        <Fragment>
            {visibility[0] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Books</span>
                                <Link to="/books/new">
                                    <IconButton>+</IconButton>
                                </Link>
                                {searchTerm && (
                                    <SearchResultCount>
                                        {`${bookList.length} ${
                                            bookList.length !== 1
                                                ? 'results'
                                                : 'result'
                                        }`}
                                    </SearchResultCount>
                                )}
                            </div>
                            <div>
                                <SingleViewButton
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            true,
                                            false,
                                            false
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </SingleViewButton>
                            </div>
                        </div>
                    </SectionHeader>
                    {books.loading ? (
                        <Placeholder>
                            <Spinner />
                        </Placeholder>
                    ) : (
                        <ScrollableList>{bookList}</ScrollableList>
                    )}
                </Fragment>
            )}

            {visibility[1] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Discs</span>
                                <Link to="/discs/new">
                                    <IconButton>+</IconButton>
                                </Link>
                                {searchTerm && (
                                    <SearchResultCount>
                                        {`${discList.length} ${
                                            discList.length !== 1
                                                ? 'results'
                                                : 'result'
                                        }`}
                                    </SearchResultCount>
                                )}
                            </div>
                            <div>
                                <SingleViewButton
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            false,
                                            true,
                                            false
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </SingleViewButton>
                            </div>
                        </div>
                    </SectionHeader>
                    {discs.loading ? (
                        <Placeholder>
                            <Spinner />
                        </Placeholder>
                    ) : (
                        <ScrollableList>{discList}</ScrollableList>
                    )}
                </Fragment>
            )}

            {visibility[2] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Games</span>
                                <Link to="/games/new">
                                    <IconButton>+</IconButton>
                                </Link>
                                {searchTerm && (
                                    <SearchResultCount>
                                        {`${gameList.length} ${
                                            gameList.length !== 1
                                                ? 'results'
                                                : 'result'
                                        }`}
                                    </SearchResultCount>
                                )}
                            </div>
                            <div>
                                <SingleViewButton
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            false,
                                            false,
                                            true
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </SingleViewButton>
                            </div>
                        </div>
                    </SectionHeader>
                    {games.loading ? (
                        <Placeholder>
                            <Spinner />
                        </Placeholder>
                    ) : (
                        <ScrollableList>{gameList}</ScrollableList>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default HomePage;

const Placeholder = styled.div`
    height: ${props => props.theme.itemHeight};
    background-image: white ${props => props.theme.itemHeight}, transparent 0;
    margin-left: 1vh;
    margin-right: 1vh;
    background-position: 0 0;
`;

const SingleViewButton = styled(Button)`
    /* Don't show this button on mobile layout 
        Scrolling on mobile is already a good experience, switching to a vertical scroll to view all
        is currently deemed unnecessary  
    */
    @media (max-width: 768px) {
        display: none;
    }
`;
