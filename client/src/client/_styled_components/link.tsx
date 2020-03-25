import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

const Link = styled(RouterLink)`
    text-decoration: none;
    color: inherit;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
        color: inherit;
    }
`;

export default (props: any) => <Link {...props} />;
