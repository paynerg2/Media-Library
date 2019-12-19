import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
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
import { RouteComponentProps, withRouter } from 'react-router';

interface MatchProps {
    id: string;
}

const NewDiscPage: React.FunctionComponent<RouteComponentProps<
    MatchProps
>> = props => {
    const { id } = props.match.params;
    const dispatch = useDispatch();
    const creatorsById = useSelector(state => state.creators.byId);
    const seriesById = useSelector(state => state.series.byId);
    const companiesById = useSelector(state => state.companies.byId);

    const selectedDisc = useSelector(state => state.discs.byId[id]);
    const initialValues = selectedDisc ? selectedDisc : defaultDisc;

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
        expectedCompanies.forEach(company =>
            assureCompanyExists(companiesById, dispatch, company, props.title)
        );
        assureSeriesExists(seriesById, dispatch, props.series, props.title);
    };

    return (
        <Fragment>
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
                        <label htmlFor="director">Director:</label>
                        <Field
                            id="director"
                            name="director"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.director}
                            type="text"
                            placeholder="Director"
                        />
                        <ErrorMessage name="director" />
                        <label htmlFor="studio">Studio:</label>
                        <Field
                            id="studio"
                            name="studio"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.studio}
                            type="text"
                            placeholder="Studio"
                        />
                        <ErrorMessage name="studio" />
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
                                                            values.languages[
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
                                            Add language
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="languages" />
                        <label htmlFor="subtitles">Subtitles:</label>
                        <FieldArray
                            name="subtitles"
                            render={arrayHelpers => (
                                <div>
                                    {values.subtitles &&
                                    values.subtitles.length > 0 ? (
                                        values.subtitles.map(
                                            (language, index) => (
                                                <div key={index}>
                                                    <Field
                                                        id={`subtitles.${index}`}
                                                        name={`subtitles.${index}`}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="text"
                                                        value={
                                                            values.subtitles![
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
                                            Add subtitle language
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                        <ErrorMessage name="subtitles" />
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
                        <label htmlFor="isCollection">
                            Is this a collection?
                        </label>
                        <Field
                            id="isCollection"
                            name="isCollection"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.isCollection}
                            type="checkbox"
                        />
                        <ErrorMessage name="isCollection" />
                        <label htmlFor="format">Formats:</label>
                        <Field
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
                                <option key={format} value={format}>
                                    {format}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name="format" />
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                validationErrorExists(errors, touched)
                            }
                        >
                            {id ? 'Edit Disc' : 'Add Disc'}
                        </button>
                    </form>
                )}
            </Formik>
        </Fragment>
    );
};

export default withRouter(NewDiscPage);
