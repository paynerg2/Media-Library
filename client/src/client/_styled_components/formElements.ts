import styled from 'styled-components';
import { Field } from 'formik';
import { SectionHeader } from './sectionHeader';

export const FormHeader = styled(SectionHeader)`
    font-family: ${props => props.theme.fonts.primary};
    font-size: 2.3em;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;

    &::after {
        border-color: #000;
    }
`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-items: center;
    width: 40vw;
    min-width: 480px;
    margin: 5vh;

    @media (max-width: 768px) {
        min-width: 0;
        width: 100%;
        margin: 0;
    }
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    & > div {
        margin-top: 4vh;
    }

    & > * {
        @media (max-width: 768px) {
            margin: 0 2vw;
            border-radius: 0;
        }
    }
`;

export const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 5vh;
    margin-bottom: 5vh;
    width: 100%;

    & > button {
        border-radius: 2px;
    }

    @media (max-width: 768px) {
        margin-top: 0;
        flex-direction: column;
        align-content: center;
        align-items: center;

        & > button {
            margin-top: 0.5vh;
            width: 60%;
            height: 8vh;
        }
    }
`;

export const StyledField = styled(Field)`
    padding: 12px;
    border-radius: 2px;
    font-family: ${props => props.theme.fonts.primary};
    border: 2px solid ${props => props.theme.colors.seperator};
    font-size: 1.1em;
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    opacity: 0.8;
    min-width: 80%;
    margin-top: 1vh;
    background-color: ${props => props.theme.colors.background};

    &:focus,
    :active {
        outline: none;
    }

    &::placeholder {
        font-weight: bold;
        font-style: italic;
        font-size: 1em;
        opacity: 0.7;
        letter-spacing: 0.2em;
    }
`;

export const Label = styled.label`
    font-family: ${props => props.theme.fonts.primary};
    color: ${props => props.theme.colors.label};
    opacity: 0.8;
    font-size: 1.3em;
    letter-spacing: 0.1em;
    font-weight: bold;
    text-transform: capitalize;
    margin-top: 1vh;
`;

export const Error = styled.div`
    color: ${props => props.theme.colors.contrastText};
    opacity: 0.7;
    font-size: 0.8em;
    font-family: ${props => props.theme.fonts.error};
    background-color: ${props => props.theme.colors.error};
    padding-left: 12px;

    @media (max-width: 768px) {
        font-size: 1.4em;
    }
`;

export const Select = styled.select`
    padding: 12px;
    border-radius: 2px;
    font-size: 1.1em;
    font-family: ${props => props.theme.fonts.primary};
    font-weight: bold;
    border: 1px solid rgba(88, 88, 88, 0.2);
    text-transform: capitalize;
    margin-top: 1vh;
    font-family: ${props => props.theme.fonts.primary};
    color: ${props => props.theme.colors.text};
    opacity: 0.8;
    background-color: ${props => props.theme.colors.background};

    &:focus,
    :active {
        outline: none;
    }
`;

export const SelectOption = styled.option`
    padding: 8px;
    background-color: ${props => props.theme.colors.background};
    text-transform: capitalize;
    font-size: 0.9em;
`;

export const CheckboxLabel = styled(Label)`
    color: #444;
    opacity: 0.6;

    &:hover {
        transition: all 0.5s ease-in-out;
        opacity: 0.8;
        color: ${props => props.theme.colors.secondary};
    }
`;

export const Checkbox = styled(Field)`
    appearance: none;
    height: 0.5vh;
    width: 100px;
    border-radius: 8px;
    margin: 0;
    display: none;

    &:focus {
        outline: none;
    }

    &:checked {
        background-color: ${props => props.theme.colors.primary};
        box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.05);
        display: flex;
    }
`;

export const FieldCollectionLabel = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1vh;
    justify-content: space-between;
    border-bottom: 2px solid ${props => props.theme.colors.seperator};
`;

export const FormatFields = styled.div`
    max-width: 40vh;
    min-height: 4vh;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 2px solid ${props => props.theme.colors.seperator};
    padding: 12px;

    @media (max-width: 768px) {
        max-width: 100%;
        justify-content: space-around;
        margin: 0 2vw;
    }
`;

export const CollectionSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > div {
        margin-right: 1vh;
    }

    & > img {
        max-height: 65vh;
    }

    @media (max-width: 768px) {
        & > img {
            display: none;
        }
    }
`;
