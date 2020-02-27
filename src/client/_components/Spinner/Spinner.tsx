import React from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';
import { theme as lightTheme, darkTheme } from '../../App/theme';
import { useDarkMode } from '../../_hooks';

export const Spinner = () => {
    const { theme } = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    return (
        <Container>
            <Loader
                type="TailSpin"
                color={themeMode.colors.primary}
                height={150}
                width={150}
                timeout={3000}
            />
        </Container>
    );
};

const Container = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
