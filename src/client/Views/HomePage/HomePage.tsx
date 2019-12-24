import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemList } from '../../_components/ItemList';
import { ListScroller } from '../../_components/ListScroller';
import { useSelector } from '../../_hooks';
import { SearchBar } from '../../_components/SearchBar/';
import { getFilteredList } from '../../_helpers/getFilteredList';

const HomePage: React.FC = () => {
    const length: number = 3;
    const [searchTerm, setSearchTerm] = useState('');
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

    return (
        <Fragment>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div>Library</div>
            <br />
            <div>Books</div>
            {visibility[0] && (
                <div>
                    <ListScroller>
                        <ItemList
                            length={singleView ? bookList.length : length}
                        >
                            {bookList}
                        </ItemList>
                    </ListScroller>
                    <button
                        onClick={() =>
                            handleVisibilityToggle([true, false, false])
                        }
                    >
                        {getButtonText()}
                    </button>
                    {singleView && (
                        <button>
                            <Link to="/books/new">+</Link>
                        </button>
                    )}
                </div>
            )}

            <br />
            <div>Discs</div>
            {visibility[1] && (
                <div>
                    <ListScroller>
                        <ItemList
                            length={singleView ? discList.length : length}
                        >
                            {discList}
                        </ItemList>
                    </ListScroller>
                    <button
                        onClick={() =>
                            handleVisibilityToggle([false, true, false])
                        }
                    >
                        {getButtonText()}
                    </button>
                    {singleView && (
                        <button>
                            <Link to="/discs/new">+</Link>
                        </button>
                    )}
                </div>
            )}

            <br />
            <div>Games</div>
            {visibility[2] && (
                <div>
                    <ListScroller>
                        <ItemList
                            length={singleView ? gameList.length : length}
                        >
                            {gameList}
                        </ItemList>
                    </ListScroller>
                    <button
                        onClick={() =>
                            handleVisibilityToggle([false, false, true])
                        }
                    >
                        {getButtonText()}
                    </button>
                    {singleView && visibility[2] && (
                        <button>
                            <Link to="/games/new">+</Link>
                        </button>
                    )}
                </div>
            )}

            <br />
        </Fragment>
    );
};

export default HomePage;
