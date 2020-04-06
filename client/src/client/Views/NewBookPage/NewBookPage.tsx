import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { bookSchema } from '../../../lib/schemas';
import { bookActions } from '../../_actions';
import {
    Book,
    defaultBook,
    Creator,
    Series,
    Company
} from '../../../lib/interfaces';
import { bookTypes } from '../../../lib/formats';
import { useSelector } from '../../_hooks';
import {
    assureCompanyExists,
    assureCreatorExists,
    assureSeriesExists
} from '../../_helpers/formSubmissionHelpers';
import { removeDuplicates } from '../../_helpers/removeDuplicates';
import { Button } from '../../_styled_components/button';
import { IconButton } from '../../_styled_components/iconButton';
import {
    Error,
    FormContainer,
    Section,
    Buttons,
    StyledField as Field,
    Label,
    Select,
    SelectOption,
    CheckboxLabel,
    Checkbox,
    FieldCollectionLabel,
    FormatFields,
    CollectionSection
} from '../../_styled_components/formElements';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { StringTMap } from '../../_interfaces/stringTMap.interface';
import { MongoId } from '../../_interfaces';

interface MatchProps {
    id: string;
}

const NewBookPage: React.FunctionComponent<RouteComponentProps<
    MatchProps
>> = props => {
    const dispatch = useDispatch();
    const creatorsById: StringTMap<Creator & MongoId> = useSelector(
        state => state.creators.byId
    );
    const seriesById: StringTMap<Series & MongoId> = useSelector(
        state => state.series.byId
    );
    const companiesById: StringTMap<Company & MongoId> = useSelector(
        state => state.companies.byId
    );
    const { id } = props.match.params;
    const { history } = props;
    const selectedBook = useSelector(state => state.books.byId[id]);
    const initialValues: Book = selectedBook ? selectedBook : defaultBook;

    const handleCancel = async () => {
        await props.history.goBack();
    };

    const handleSubmit = async (props: Book) => {
        id
            ? await dispatch(bookActions.update(id, props))
            : await dispatch(bookActions.create(props));

        const { authors, colorer, letterer, artists } = props;
        let expectedCreators = authors;
        colorer && expectedCreators.push(...colorer);
        letterer && expectedCreators.push(...letterer);
        artists && expectedCreators.push(...artists);
        removeDuplicates(expectedCreators).forEach(creator =>
            assureCreatorExists(creatorsById, dispatch, creator, props.title)
        );

        assureSeriesExists(seriesById, dispatch, props.series, props.title);
        props.publisher &&
            assureCompanyExists(
                companiesById,
                dispatch,
                props.publisher,
                props.title
            );
        history.push('/');
    };

    return (
        <Fragment>
            <DisplayHeader>
                {id ? `edit ${selectedBook.title}` : `add new book`}
            </DisplayHeader>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={bookSchema}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    isSubmitting
                }) => (
                    <FormContainer onSubmit={handleSubmit}>
                        <SectionHeader>Book Info</SectionHeader>
                        <Section>
                            {/* <Label htmlFor="title">Title</Label> */}
                            <Field
                                id="title"
                                name="title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                type="text"
                                autocomplete="off"
                                placeholder="Title"
                                spellcheck="false"
                            />
                            <Error>
                                <ErrorMessage name="title" />
                            </Error>

                            {/* <Label htmlFor="series">Series</Label> */}
                            <Field
                                id="series"
                                name="series"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.series}
                                placeholder="Series"
                                type="text"
                            />
                            <Error>
                                <ErrorMessage name="series" />
                            </Error>

                            <Label htmlFor="volume">Volume</Label>
                            <Field
                                id="volume"
                                name="volume"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.volume}
                                type="number"
                                autocomplete="off"
                            />
                            <Error>
                                <ErrorMessage name="volume" />
                            </Error>

                            <Label htmlFor="type">Type</Label>
                            <Select
                                name="type"
                                id="type"
                                value={values.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {bookTypes.map((type: string) => (
                                    <SelectOption key={type} value={type}>
                                        {/* Capitalize acronyms, e.g. TPB */}
                                        {type.length > 3
                                            ? type
                                            : type.toLocaleUpperCase()}
                                    </SelectOption>
                                ))}
                            </Select>
                            <Error>
                                <ErrorMessage name="type" />
                            </Error>

                            {/* <Label htmlFor="publisher">Publisher</Label> */}
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

                            {/* <Label htmlFor="isbn">ISBN</Label> */}
                            <Field
                                id="isbn"
                                name="isbn"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.isbn}
                                type="text"
                                autocomplete="off"
                                placeholder="ISBN"
                            />
                            <Error>
                                <ErrorMessage name="isbn" />
                            </Error>
                        </Section>
                        <SectionHeader>Creator Info</SectionHeader>
                        <Section>
                            <FieldArray
                                name="authors"
                                render={arrayHelpers => (
                                    <div>
                                        <FieldCollectionLabel>
                                            <Label htmlFor="authors">
                                                Authors
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
                                        {values.authors &&
                                            values.authors.map(
                                                (author, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            id={`authors.${index}`}
                                                            name={`authors.${index}`}
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            value={
                                                                values.authors[
                                                                    index
                                                                ]
                                                            }
                                                            spellcheck="false"
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
                                <ErrorMessage name="authors" />
                            </Error>

                            <FieldArray
                                name="artists"
                                render={arrayHelpers => (
                                    <div>
                                        <FieldCollectionLabel>
                                            <Label htmlFor="artists">
                                                Artists
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
                                        {values.artists &&
                                            values.artists.map(
                                                (artist, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            id={`artists.${index}`}
                                                            name={`artists.${index}`}
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            value={
                                                                values.artists![
                                                                    index
                                                                ]
                                                            }
                                                            spellcheck="false"
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
                                <ErrorMessage name="artists" />
                            </Error>

                            <FieldArray
                                name="colorer"
                                render={arrayHelpers => (
                                    <div>
                                        <FieldCollectionLabel>
                                            <Label htmlFor="colorer">
                                                Colorer
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
                                        {values.colorer &&
                                            values.colorer.map(
                                                (colorer, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            id={`colorer.${index}`}
                                                            name={`colorer.${index}`}
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            value={
                                                                values.colorer![
                                                                    index
                                                                ]
                                                            }
                                                            spellcheck="false"
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
                                <ErrorMessage name="colorer" />
                            </Error>

                            <FieldArray
                                name="letterer"
                                render={arrayHelpers => (
                                    <div>
                                        <FieldCollectionLabel>
                                            <Label htmlFor="letterer">
                                                Letterer
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
                                        {values.letterer &&
                                            values.letterer.map(
                                                (letterer, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            id={`letterer.${index}`}
                                                            name={`letterer.${index}`}
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            value={
                                                                values.letterer![
                                                                    index
                                                                ]
                                                            }
                                                            spellcheck="false"
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
                                <ErrorMessage name="letterer" />
                            </Error>
                        </Section>

                        <SectionHeader>Collection Info</SectionHeader>
                        <CollectionSection>
                            <Section>
                                {/* <Label htmlFor="listPrice">List Price</Label> */}
                                <Field
                                    id="listPrice"
                                    name="listPrice"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.listPrice}
                                    type="text"
                                    autocomplete="off"
                                    placeholder="List Price"
                                />
                                <Error>
                                    <ErrorMessage name="listPrice" />
                                </Error>

                                {/* <Label htmlFor="language">Language</Label> */}
                                <Field
                                    id="language"
                                    name="language"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.language}
                                    type="text"
                                    autocomplete="language"
                                    placeholder="Language"
                                />
                                <Error>
                                    <ErrorMessage name="language" />
                                </Error>
                                {/* <Label htmlFor="location">Location</Label> */}
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
                                {/* <Label htmlFor="image">Image</Label> */}
                                <Field
                                    name="image"
                                    id="image"
                                    value={values.image}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type="text"
                                    placeholder="Image"
                                    autocomplete="off"
                                    spellcheck="false"
                                />
                                <Error>
                                    <ErrorMessage name="image" />
                                </Error>

                                <Label>Formats</Label>
                                <FormatFields>
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
                                </FormatFields>
                                <Error>
                                    <ErrorMessage name="digital" />
                                    <ErrorMessage name="physical" />
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
                                {id ? 'Edit Book' : 'Add Book'}
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
        </Fragment>
    );
};

export default withRouter(NewBookPage);
