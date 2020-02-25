import styled from 'styled-components';

export const SectionHeader = styled.h2`
    font-family: ${props => props.theme.fonts.primary};
    color: ${props => props.theme.colors.text};
    font-weight: bold;
    text-transform: uppercase;
    font-stretch: semi-expanded;

    /* Put content on opposite sides of the header */
    & > div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }

    /* Center align search result count */
    & > div > div {
        display: flex;
        align-items: center;
    }

    /* Draw a styled section break under the header */
    &::after {
        content: ' ';
        display: block;
        border: 0.4vh solid ${props => props.theme.colors.primary};
        opacity: 0.5;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
        -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    }
`;
