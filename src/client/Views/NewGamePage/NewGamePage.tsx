import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { useSelector } from '../../_helpers/useSelector';
import {
    assureCompanyExists,
    assureCreatorExists,
    assureSeriesExists
} from '../../_helpers/formSubmissionHelpers';

import { gameSchema } from '../../../lib/schemas';
import { gameActions } from '../../_actions';
import { Game, defaultGame } from '../../../lib/interfaces';

const NewGamePage: React.FC = () => {
    const dispatch = useDispatch();
    const seriesById = useSelector(state => state.series.byId);
    const companiesById = useSelector(state => state.companies.byId);

    const handleSubmit = async (props: Game) => {
        await dispatch(gameActions.create(props));

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
                initialValues={defaultGame}
                onSubmit={handleSubmit}
                validationSchema={gameSchema}
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
                        <label htmlFor="platforms">Platforms:</label>
                        <FieldArray
                            name="platforms"
                            render={arrayHelpers => (
                                <div>
                                    {values.platforms &&
                                    values.platforms.length > 0 ? (
                                        values.platforms.map(
                                            (platform, index) => (
                                                <div key={index}>
                                                    <Field
                                                        id={`platforms.${index}`}
                                                        name={`platforms.${index}`}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={
                                                            values.platforms![
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
                                            Add a platform
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="platforms" />
                        <label htmlFor="languages">Languages:</label>
                        <FieldArray
                            name="languages"
                            render={arrayHelpers => (
                                <div>
                                    {values.languages &&
                                    values.languages.length > 0 ? (
                                        values.languages.map(
                                            (language, index) => (
                                                <div key={index}>
                                                    <Field
                                                        id={`languages.${index}`}
                                                        name={`languages.${index}`}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={
                                                            values.languages![
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
                                            Add a language
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="languages" />
                        <label htmlFor="genre">Genre:</label>
                        <Field
                            id="genre"
                            name="genre"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.genre}
                            type="text"
                            placeholder="Genre"
                        />
                        <ErrorMessage name="genre" />
                        <label htmlFor="multiplayer">
                            Is there multiplayer?
                        </label>
                        <Field
                            id="multiplayer"
                            name="multiplayer"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.multiplayer}
                            type="checkbox"
                        />
                        <ErrorMessage name="multiplayer" />
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
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                validationErrorExists(errors, touched)
                            }
                        >
                            Add Game
                        </button>
                    </form>
                )}
            </Formik>
        </Fragment>
    );
};

export default NewGamePage;