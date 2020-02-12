import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../_hooks/useSelector';
import { searchActions } from '../../_actions';

export const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const initialTerm = useSelector(state => state.search.term);
    const [searchTerm, setSearchTerm] = useState(initialTerm);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        dispatch(searchActions.search(e.target.value));
    };

    return (
        <Fragment>
            <ExpanandableSearchBar
                type="search"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search Media Library..."
                spellCheck={false}
            />
        </Fragment>
    );
};

const ExpanandableSearchBar = styled.input`
    outline: none;
    font-family: ${props => props.theme.fonts.primary};
    font-size: 100%;
    background: #ededed;
    background-image: url('https://static.tumblr.com/ftv85bp/MIXmud4tx/search-icon.png');
    background-repeat: no-repeat;
    background-position: 9px center;
    border: solid 1px #ccc;
    padding: 9px 10px 9px 25px;
    height: 5vh;
    width: 32px;
    color: transparent;
    border-radius: 10em;
    transition: all 0.5s;
    cursor: pointer;
    margin-right: 1vw;

    &:hover {
        background-color: #fff;
    }

    &:focus {
        width: 25vw;
        padding-left: 32px;
        color: black;
        background-color: #fff;
        cursor: auto;
    }
`;
