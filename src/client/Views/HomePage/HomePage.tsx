import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListScroller } from '../../_components/ListScroller';
import { useSelector } from '../../_hooks';
import { SearchBar } from '../../_components/SearchBar/';
import { getFilteredList } from '../../_helpers/getFilteredList';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { Button } from '../../_styled_components/button';
import {
    useChain,
    useSpring,
    useTrail,
    ReactSpringHook,
    config
} from 'react-spring';

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

    // Note: Casting to avoid TypeCheck issue.
    const transitionRef = useRef() as React.RefObject<ReactSpringHook>;
    const transition = useSpring({
        ref: transitionRef,
        config: config.stiff,
        from: { opacity: 0, width: '0vh' },
        to: {
            opacity: singleView ? 0 : 1,
            width: singleView ? '0vh' : '4vh'
        }
    });

    const maxLength = Math.max(
        bookList.length,
        discList.length,
        gameList.length
    );
    const trailRef = useRef() as React.RefObject<ReactSpringHook>;
    const trail = useTrail(maxLength, {
        ref: trailRef,
        from: {
            marginLeft: -20,
            opacity: 1,
            transform: 'translate3d(0,-40px,0)'
        },
        to: { marginLeft: 0, opacity: 1, transform: 'translate3d(0,0px,0)' }
    });

    useEffect(() => {}, [transitionRef, trailRef]);

    // This pattern, as opposed to simply useChain([trailRef, transitionRef], ...)
    // forces the ref to update on each render, avoiding an issue which would
    // start the animations simultaneously on the initial app render.
    // https://github.com/react-spring/react-spring/issues/574
    // ref.current clears on nav leading to a stalled animation state when navigating
    // back to the homepage.
    // This pattern avoids both issues - another method for maintaining ref.current
    // may work as well if any bugs arise from this.
    useChain(
        [
            trailRef.current ? { current: trailRef.current } : trailRef,
            transitionRef.current
                ? { current: transitionRef.current }
                : transitionRef
        ],
        [0, 0.8]
    );

    //! Bug: Clicking View All while offset != 0 does not show entire list

    return (
        <Fragment>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <SectionHeader>Books</SectionHeader>
            {searchTerm && <div>{`${bookList.length} results`}</div>}
            {visibility[0] && (
                <div>
                    <ListScroller
                        style={transition}
                        list={bookList}
                        listStyle={trail}
                        length={singleView ? bookList.length : length}
                    />
                    <Button
                        onClick={() =>
                            handleVisibilityToggle([true, false, false])
                        }
                    >
                        {getButtonText()}
                    </Button>
                    {singleView && (
                        <button>
                            <Link to="/books/new">+</Link>
                        </button>
                    )}
                </div>
            )}

            <SectionHeader>Discs</SectionHeader>
            {searchTerm && <div>{`${discList.length} results`}</div>}
            {visibility[1] && (
                <div>
                    <ListScroller
                        style={transition}
                        list={discList}
                        listStyle={trail}
                        length={singleView ? discList.length : length}
                    />
                    <Button
                        onClick={() =>
                            handleVisibilityToggle([false, true, false])
                        }
                    >
                        {getButtonText()}
                    </Button>
                    {singleView && (
                        <button>
                            <Link to="/discs/new">+</Link>
                        </button>
                    )}
                </div>
            )}

            <SectionHeader>Games</SectionHeader>
            {searchTerm && <div>{`${gameList.length} results`}</div>}
            {visibility[2] && (
                <div>
                    <ListScroller
                        style={transition}
                        list={gameList}
                        listStyle={trail}
                        length={singleView ? gameList.length : length}
                    />
                    <Button
                        onClick={() =>
                            handleVisibilityToggle([false, false, true])
                        }
                    >
                        {getButtonText()}
                    </Button>
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
