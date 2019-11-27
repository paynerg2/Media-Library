import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { bookSchema } from '../../../lib/schemas';
import { bookActions } from '../../_actions';
import { history } from '../../_helpers/history';
import { Book, defaultBook } from '../../../lib/interfaces';
import { bookTypes } from '../../../lib/formats';
import { useSelector } from '../../_helpers/useSelector';
import {
    assureCompanyExists,
    assureCreatorExists,
    assureSeriesExists
} from '../../_helpers/formSubmissionHelpers';
const NewBookPage: React.FC = () => {
    const dispatch = useDispatch();
    const creatorsById = useSelector(state => state.creators.byId);
    const seriesById = useSelector(state => state.series.byId);
    const companiesById = useSelector(state => state.companies.byId);

    const handleSubmit = async (props: Book) => {
        await dispatch(bookActions.create(props));

        const { authors, colorer, letterer, artists } = props;
        let expectedCreators = authors;
        colorer && expectedCreators.push(...colorer);
        letterer && expectedCreators.push(...letterer);
        artists && expectedCreators.push(...artists);
        expectedCreators.forEach(creator =>
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
    };

    return (
        <Fragment>
            <Formik
                initialValues={defaultBook}
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
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="title">Title:</label>
                        <Field
                            id="title"
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.title}
                            type="text"
                            placeholder="Title"
                        />
                        <ErrorMessage name="title" />
                        <label htmlFor="authors">Authors:</label>
                        <FieldArray
                            name="authors"
                            render={arrayHelpers => (
                                <div>
                                    {values.authors &&
                                    values.authors.length > 0 ? (
                                        values.authors.map((author, index) => (
                                            <div key={index}>
                                                <Field
                                                    id={`authors.${index}`}
                                                    name={`authors.${index}`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={
                                                        values.authors[index]
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.remove(
                                                            index
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.insert(
                                                            index,
                                                            ''
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.push('')
                                            }
                                        >
                                            Add an author
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="authors" />

                        <label htmlFor="series">Series:</label>
                        <Field
                            id="series"
                            name="series"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.series}
                            type="text"
                            placeholder="Series"
                        />
                        <ErrorMessage name="series" />

                        <label htmlFor="publisher">Publisher:</label>
                        <Field
                            id="publisher"
                            name="publisher"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.publisher}
                            type="text"
                            placeholder="Publisher"
                        />
                        <ErrorMessage name="publisher" />

                        <label htmlFor="language">Language:</label>
                        <Field
                            id="language"
                            name="language"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.language}
                            type="text"
                            placeholder="Language"
                        />
                        <ErrorMessage name="language" />

                        <label htmlFor="listPrice">List Price:</label>
                        <Field
                            id="listPrice"
                            name="listPrice"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.listPrice}
                            type="text"
                            placeholder="List Price"
                        />
                        <ErrorMessage name="listPrice" />

                        <label htmlFor="location">Location:</label>
                        <Field
                            id="location"
                            name="location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            type="text"
                            placeholder="Location"
                        />
                        <ErrorMessage name="location" />

                        <label htmlFor="artists">Artists:</label>
                        <FieldArray
                            name="artists"
                            render={arrayHelpers => (
                                <div>
                                    {values.artists &&
                                    values.artists.length > 0 ? (
                                        values.artists.map((artist, index) => (
                                            <div key={index}>
                                                <Field
                                                    id={`artists.${index}`}
                                                    name={`artists.${index}`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={
                                                        values.artists![index]
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.remove(
                                                            index
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.insert(
                                                            index,
                                                            ''
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.push('')
                                            }
                                        >
                                            Add an artist
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="artists" />

                        <label htmlFor="colorer">Colorer:</label>
                        <FieldArray
                            name="colorer"
                            render={arrayHelpers => (
                                <div>
                                    {values.colorer &&
                                    values.colorer.length > 0 ? (
                                        values.colorer.map((colorer, index) => (
                                            <div key={index}>
                                                <Field
                                                    id={`colorer.${index}`}
                                                    name={`colorer.${index}`}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    type="text"
                                                    value={
                                                        values.colorer![index]
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.remove(
                                                            index
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        arrayHelpers.insert(
                                                            index,
                                                            ''
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.push('')
                                            }
                                        >
                                            Add an author
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="colorer" />

                        <label htmlFor="letterer">Letterer:</label>
                        <FieldArray
                            name="letterer"
                            render={arrayHelpers => (
                                <div>
                                    {values.letterer &&
                                    values.letterer.length > 0 ? (
                                        values.letterer.map(
                                            (letterer, index) => (
                                                <div key={index}>
                                                    <Field
                                                        id={`letterer.${index}`}
                                                        name={`letterer.${index}`}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={
                                                            values.letterer![
                                                                index
                                                            ]
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            arrayHelpers.remove(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            arrayHelpers.insert(
                                                                index,
                                                                ''
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                arrayHelpers.push('')
                                            }
                                        >
                                            Add an author
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="letterer" />

                        <label htmlFor="isbn">ISBN:</label>
                        <Field
                            id="isbn"
                            name="isbn"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.isbn}
                            type="text"
                            placeholder="ISBN"
                        />
                        <ErrorMessage name="isbn" />

                        <label htmlFor="volume">Volume:</label>
                        <Field
                            id="volume"
                            name="volume"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.volume}
                            type="number"
                            placeholder="Volume"
                        />
                        <ErrorMessage name="volume" />

                        <label htmlFor="digital">Own a digital copy?:</label>
                        <Field
                            id="digital"
                            name="digital"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.digital}
                            type="checkbox"
                        />
                        <ErrorMessage name="digital" />

                        <label htmlFor="physical">Own a physical copy?:</label>
                        <Field
                            id="physical"
                            name="physical"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.physical}
                            type="checkbox"
                        />
                        <ErrorMessage name="physical" />

                        <label htmlFor="type">Type:</label>
                        <select
                            name="type"
                            id="type"
                            value={values.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        >
                            {bookTypes.map(type => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <ErrorMessage name="type" />

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                validationErrorExists(errors, touched)
                            }
                        >
                            Add Book
                        </button>
                    </form>
                )}
            </Formik>
        </Fragment>
    );
};

export default NewBookPage;
