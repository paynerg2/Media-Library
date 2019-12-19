import React, { Fragment } from 'react';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchBar: React.FunctionComponent<SearchBarProps> = props => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchTerm(e.target.value);
    };

    return (
        <Fragment>
            <input
                type="text"
                value={props.searchTerm}
                onChange={handleChange}
                placeholder="Search..."
            />
        </Fragment>
    );
};
