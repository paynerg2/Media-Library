import React, { Fragment, useState, useRef, useEffect } from 'react';
import { ListScroller } from '../../_components/ListScroller';
import { useSelector, useWindowSize } from '../../_hooks';
import { getFilteredList } from '../../_helpers/getFilteredList';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { Button } from '../../_styled_components/button';
import { IconButton } from '../../_styled_components/iconButton';
import Link from '../../_styled_components/link';
import { SearchResultCount } from '../../_styled_components/searchResultCount';
import { useChain, useSpring, ReactSpringHook, config } from 'react-spring';
import { WindowSizeObject } from '../../_interfaces';
import styled from 'styled-components';

//! Redirect from login does not load data

const HomePage: React.FC = () => {
    const size: WindowSizeObject = useWindowSize();
    const calculateLength = (): number => {
        const ratio =
            size.width && size.height ? size.height / size.width : undefined;
        let length = 1;
        while (!!ratio && 12 + (length + 1) * 21 * ratio < 100) {
            length++;
        }
        return length;
    };
    const length: number = calculateLength();

    //const [searchTerm, setSearchTerm] = useState('');
    const searchTerm = useSelector(state => state.search.term);
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

    // todo: clean this section up, rename variables
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

    const transRef = useRef() as React.RefObject<ReactSpringHook>;

    // This fixes an issue with tracking ref.current
    useEffect(() => {}, [transitionRef, transRef]);

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
            transRef.current ? { current: transRef.current } : transRef,
            transitionRef.current
                ? { current: transitionRef.current }
                : transitionRef
        ],
        [0, 0.8]
    );

    //! Bug: Clicking View All while offset != 0 does not show entire list

    return (
        <Fragment>
            {visibility[0] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Books</span>
                                <IconButton>
                                    <Link to="/books/new">+</Link>
                                </IconButton>
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
                                <Button
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            true,
                                            false,
                                            false
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </Button>
                            </div>
                        </div>
                    </SectionHeader>
                    <div>
                        {books.loading ? (
                            <Placeholder />
                        ) : (
                            <ListScroller
                                style={transition}
                                list={bookList}
                                listRef={transRef}
                                length={singleView ? bookList.length : length}
                            />
                        )}
                    </div>
                </Fragment>
            )}

            {visibility[1] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Discs</span>
                                <IconButton>
                                    <Link to="/discs/new">+</Link>
                                </IconButton>
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
                                <Button
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            false,
                                            true,
                                            false
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </Button>
                            </div>
                        </div>
                    </SectionHeader>
                    <div>
                        {discs.loading ? (
                            <Placeholder />
                        ) : (
                            <ListScroller
                                style={transition}
                                list={discList}
                                listRef={transRef}
                                length={singleView ? discList.length : length}
                            />
                        )}
                    </div>
                </Fragment>
            )}

            {visibility[2] && (
                <Fragment>
                    <SectionHeader>
                        <div>
                            <div>
                                <span>Games</span>
                                <IconButton>
                                    <Link to="/games/new">+</Link>
                                </IconButton>
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
                                <Button
                                    onClick={() =>
                                        handleVisibilityToggle([
                                            false,
                                            false,
                                            true
                                        ])
                                    }
                                >
                                    {getButtonText()}
                                </Button>
                            </div>
                        </div>
                    </SectionHeader>
                    <div>
                        {games.loading ? (
                            <Placeholder />
                        ) : (
                            <ListScroller
                                style={transition}
                                list={gameList}
                                listRef={transRef}
                                length={singleView ? gameList.length : length}
                            />
                        )}
                    </div>
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
