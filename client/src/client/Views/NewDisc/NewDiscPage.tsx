import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { discSchema } from '../../../lib/schemas';
import { discActions } from '../../_actions';
import { Disc, defaultDisc } from '../../../lib/interfaces';
import { discFormats } from '../../../lib/formats';
import { useSelector } from '../../_hooks';
import {
    assureCompanyExists,
    assureCreatorExists,
    assureSeriesExists
} from '../../_helpers/formSubmissionHelpers';
import {
    FormContainer,
    Section,
    Label,
    StyledField as Field,
    Buttons,
    Checkbox,
    CheckboxLabel,
    FormatFields,
    Error,
    FieldCollectionLabel,
    CollectionSection
} from '../../_styled_components/formElements';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { Button } from '../../_styled_components/button';
import { IconButton } from '../../_styled_components/iconButton';
import { removeDuplicates } from '../../_helpers/removeDuplicates';

interface MatchProps {
    id: string;
}

const NewDiscPage: React.FunctionComponent<RouteComponentProps<
    MatchProps
>> = props => {
    const { id } = props.match.params;
    const { history } = props;
    const dispatch = useDispatch();

    // Get necessary information to display form values for editing.
    const loading = useSelector(state => state.books.loading);
    const creatorsById = useSelector(state => state.creators.byId);
    const seriesById = useSelector(state => state.series.byId);
    const companiesById = useSelector(state => state.companies.byId);
    const selectedDisc = useSelector(state => state.discs.byId[id]);

    // Update with selected disc once/if values are available.
    let [initialValues, setInitialValues] = useState(defaultDisc);
    useEffect(() => {
        setInitialValues(selectedDisc ? selectedDisc : defaultDisc);
    }, [selectedDisc]);

    const handleCancel = async () => {
        await props.history.goBack();
    };

    const handleSubmit = async (props: Disc) => {
        // Create new disc
        id
            ? await dispatch(discActions.update(id, props))
            : await dispatch(discActions.create(props));

        // Ensure that any creators, companies or series related to
        // the new disc also have database entries.
        const { director, studio, publisher } = props;

        director &&
            assureCreatorExists(creatorsById, dispatch, director, props.title);
        let expectedCompanies = [];
        publisher && expectedCompanies.push(publisher);
        studio && expectedCompanies.push(studio);
        removeDuplicates(expectedCompanies).forEach(company =>
            assureCompanyExists(companiesById, dispatch, company, props.title)
        );
        assureSeriesExists(seriesById, dispatch, props.series, props.title);
        history.push('/');
    };

    return (
        <Fragment>
            <DisplayHeader>
                {id && selectedDisc
                    ? `edit ${selectedDisc.title}`
                    : `add new disc`}
            </DisplayHeader>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={discSchema}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        setFieldValue
                    }) => (
                        <FormContainer onSubmit={handleSubmit}>
                            <SectionHeader>Disc Info</SectionHeader>
                            <Section>
                                <Field
                                    id="title"
                                    name="title"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.title}
                                    type="text"
                                    placeholder="Title"
                                />
                                <Error>
                                    <ErrorMessage name="title" />
                                </Error>
                                <Field
                                    id="series"
                                    name="series"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.series}
                                    type="text"
                                    placeholder="Series"
                                    spellcheck="false"
                                />
                                <Error>
                                    <ErrorMessage name="series" />
                                </Error>

                                <Field
                                    id="publisher"
                                    name="publisher"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.publisher}
                                    type="text"
                                    placeholder="Publisher"
                                />
                                <Error>
                                    <ErrorMessage name="publisher" />
                                </Error>
                                <Label htmlFor="volume">Volume</Label>
                                <Field
                                    id="volume"
                                    name="volume"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.volume}
                                    type="number"
                                    placeholder="Volume"
                                />
                                <Error>
                                    <ErrorMessage name="volume" />
                                </Error>

                                <FieldArray
                                    name="languages"
                                    render={arrayHelpers => (
                                        <div>
                                            <FieldCollectionLabel>
                                                <Label htmlFor="languages">
                                                    Languages
                                                </Label>
                                                <IconButton
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.push('')
                                                    }
                                                >
                                                    +
                                                </IconButton>
                                            </FieldCollectionLabel>
                                            {values.languages &&
                                                values.languages.map(
                                                    (language, index) => (
                                                        <div key={index}>
                                                            <Field
                                                                id={`languages.${index}`}
                                                                name={`languages.${index}`}
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                type="text"
                                                                autocomplete="language"
                                                                value={
                                                                    values
                                                                        .languages[
                                                                        index
                                                                    ]
                                                                }
                                                            />
                                                            <IconButton
                                                                type="button"
                                                                onClick={() =>
                                                                    arrayHelpers.remove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </IconButton>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    )}
                                />
                                <Error>
                                    <ErrorMessage name="languages" />
                                </Error>
                                <FieldArray
                                    name="subtitles"
                                    render={arrayHelpers => (
                                        <div>
                                            <FieldCollectionLabel>
                                                <Label htmlFor="subtitles">
                                                    Subtitles
                                                </Label>
                                                <IconButton
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.push('')
                                                    }
                                                >
                                                    +
                                                </IconButton>
                                            </FieldCollectionLabel>
                                            {values.subtitles &&
                                                values.subtitles.map(
                                                    (language, index) => (
                                                        <div key={index}>
                                                            <Field
                                                                id={`subtitles.${index}`}
                                                                name={`subtitles.${index}`}
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                type="text"
                                                                value={
                                                                    values.subtitles![
                                                                        index
                                                                    ]
                                                                }
                                                            />
                                                            <IconButton
                                                                type="button"
                                                                onClick={() =>
                                                                    arrayHelpers.remove(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </IconButton>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    )}
                                />
                                <Error>
                                    <ErrorMessage name="subtitles" />
                                </Error>
                            </Section>

                            <SectionHeader>Creator Info</SectionHeader>
                            <Section>
                                <Field
                                    id="director"
                                    name="director"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.director}
                                    type="text"
                                    placeholder="Director"
                                    spellcheck="false"
                                />
                                <Error>
                                    <ErrorMessage name="director" />
                                </Error>
                                <Field
                                    id="studio"
                                    name="studio"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.studio}
                                    type="text"
                                    placeholder="Studio"
                                />
                                <Error>
                                    <ErrorMessage name="studio" />
                                </Error>
                            </Section>

                            <SectionHeader>Collection Info</SectionHeader>
                            <CollectionSection>
                                <Section>
                                    <Field
                                        id="listPrice"
                                        name="listPrice"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.listPrice}
                                        type="text"
                                        placeholder="List Price"
                                    />
                                    <Error>
                                        <ErrorMessage name="listPrice" />
                                    </Error>
                                    <Field
                                        id="location"
                                        name="location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.location}
                                        type="text"
                                        placeholder="Location"
                                    />
                                    <Error>
                                        <ErrorMessage name="location" />
                                    </Error>
                                    <div>
                                        <Label htmlFor="isCollection">
                                            Is this a collection?
                                        </Label>
                                        <CollectionCheckbox
                                            htmlFor="isCollection"
                                            checked={values.isCollection}
                                        >
                                            {values.isCollection ? 'YES' : 'NO'}
                                        </CollectionCheckbox>
                                        <Field
                                            id="isCollection"
                                            name="isCollection"
                                            type="checkbox"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.isCollection}
                                            checked={values.isCollection}
                                            style={{
                                                appearance: 'none',
                                                height: '0'
                                            }}
                                        />
                                        <Error>
                                            <ErrorMessage name="isCollection" />
                                        </Error>
                                    </div>

                                    <Label htmlFor="format">Formats</Label>
                                    <FormatFields style={{ marginTop: '0' }}>
                                        <div>
                                            <CheckboxLabel htmlFor="digital">
                                                digital
                                            </CheckboxLabel>
                                            <Checkbox
                                                id="digital"
                                                name="digital"
                                                type="checkbox"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.digital}
                                                checked={values.digital}
                                            />
                                        </div>
                                        <div>
                                            <CheckboxLabel htmlFor="physical">
                                                physical
                                            </CheckboxLabel>
                                            <Checkbox
                                                id="physical"
                                                name="physical"
                                                type="checkbox"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.physical}
                                                checked={values.physical}
                                            />
                                        </div>
                                        <Error>
                                            <ErrorMessage name="digital" />
                                            <ErrorMessage name="physical" />
                                        </Error>
                                    </FormatFields>
                                    {values.physical && (
                                        <FormatSelect
                                            component="select"
                                            multiple={true}
                                            name="format"
                                            id="format"
                                            value={values.format}
                                            onBlur={handleBlur}
                                            onChange={(evt: any) =>
                                                setFieldValue(
                                                    'format',
                                                    [...evt.target.options]
                                                        .filter(o => o.selected)
                                                        .map(o => o.value)
                                                )
                                            }
                                        >
                                            {discFormats.map(format => (
                                                <Format
                                                    key={format}
                                                    value={format}
                                                >
                                                    {format}
                                                </Format>
                                            ))}
                                        </FormatSelect>
                                    )}
                                    <Error>
                                        <ErrorMessage name="format" />
                                    </Error>
                                    <Label htmlFor="image">Image</Label>
                                    <Field
                                        name="image"
                                        id="image"
                                        value={values.image}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        type="text"
                                        placeholder="Image URL"
                                        spellcheck="false"
                                    />
                                    <Error>
                                        <ErrorMessage name="image" />
                                    </Error>
                                </Section>
                                {values.image && (
                                    <img src={values.image} alt="Cover" />
                                )}
                            </CollectionSection>
                            <Buttons>
                                <Button
                                    type="submit"
                                    disabled={
                                        isSubmitting ||
                                        validationErrorExists(errors, touched)
                                    }
                                >
                                    {id ? 'Edit Disc' : 'Add Disc'}
                                </Button>

                                <Button
                                    type="button"
                                    style={{
                                        backgroundColor: 'lightgrey',
                                        borderColor: 'lightgrey'
                                    }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Buttons>
                        </FormContainer>
                    )}
                </Formik>
            )}
        </Fragment>
    );
};

export default withRouter(NewDiscPage);

const Format = styled.option`
    font-family: ${props => props.theme.fonts.secondary};
    font-weight: bold;
    font-size: 1.1em;
    border: 1px solid ${props => props.theme.colors.label};
    border-radius: 1em;
    width: 20%;
    min-width: 80px;
    height: auto;
    text-align: center;
    text-transform: uppercase;
    padding: 4px;
    margin-top: 1vh;
    /* Browser limitations appear to prevent customization of 
       :checked selector background-color and color properties */
`;

const FormatSelect = styled(Field)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 35vh;
    background: ${props => props.theme.colors.background};
    border: none;
    overflow: hidden;
`;

const CollectionCheckbox = styled.label<{ checked: boolean }>`
    height: 4vh;
    line-height: 4vh;
    width: 6vw;
    font-size: 1.1em;
    font-family: ${props => props.theme.fonts.secondary};
    font-weight: bold;
    text-align: center;
    color: ${props =>
        props.checked ? props.theme.colors.primary : 'lightgrey'};
    border: 3px solid
        ${props => (props.checked ? props.theme.colors.primary : 'lightgrey')};
    opacity: 0.8;
    border-radius: 3em;
    display: inline-block;
    margin-left: 2vw;

    &:hover {
        cursor: pointer;
    }

    @media (max-width: 768px) {
        width: 15vw;
    }
`;
