import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemContainer } from '../../_components/ItemContainer';
import { ItemList } from '../../_components/ItemList';
import { ListScroller } from '../../_components/ListScroller';
import { useSelector } from '../../_helpers/useSelector';

const HomePage: React.FC = () => {
    const length: number = 3;
    const { books, discs, games } = useSelector(state => state);

    const bookList: JSX.Element[] = books.allIds.map(id => (
        <ItemContainer key={id} id={id} item={books.byId[id]} route={'books'} />
    ));
    const discList: JSX.Element[] = discs.allIds.map(id => (
        <ItemContainer key={id} id={id} item={discs.byId[id]} route={'discs'} />
    ));
    const gameList: JSX.Element[] = games.allIds.map(id => (
        <ItemContainer key={id} id={id} item={games.byId[id]} route={'games'} />
    ));

    const [visibility, setVisibility] = useState([true, true, true]);
    const [singleView, setSingleView] = useState(false);

    return (
        <Fragment>
            <div>Library</div>
            <br />
            <div>Books</div>
            {visibility[0] && (
                <ListScroller>
                    <ItemList length={singleView ? bookList.length : length}>
                        {bookList}
                    </ItemList>
                </ListScroller>
            )}
            <button
                onClick={() => {
                    setVisibility([true, false, false]);
                    setSingleView(true);
                }}
            >
                View All
            </button>
            {singleView && visibility[0] && (
                <button>
                    <Link to="/books/new">+</Link>
                </button>
            )}
            <br />
            <div>Discs</div>
            {visibility[1] && (
                <ListScroller>
                    <ItemList length={length}>{discList}</ItemList>
                </ListScroller>
            )}
            <button
                onClick={() => {
                    setVisibility([false, true, false]);
                    setSingleView(true);
                }}
            >
                View All
            </button>
            <br />
            <div>Games</div>
            {visibility[2] && (
                <ListScroller>
                    <ItemList length={length}>{gameList}</ItemList>
                </ListScroller>
            )}
            <button
                onClick={() => {
                    setVisibility([false, false, true]);
                    setSingleView(true);
                }}
            >
                View All
            </button>
            <br />
        </Fragment>
    );
};

export default HomePage;
