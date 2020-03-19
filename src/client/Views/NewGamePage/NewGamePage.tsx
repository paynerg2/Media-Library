import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Formik, FieldArray, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { useSelector } from '../../_hooks';
import {
    assureCompanyExists,
    assureSeriesExists
} from '../../_helpers/formSubmissionHelpers';

import { gameSchema } from '../../../lib/schemas';
import { gameActions } from '../../_actions';
import { Game, defaultGame } from '../../../lib/interfaces';

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
    FieldCollectionLabel
} from '../../_styled_components/formElements';
import { IconButton } from '../../_styled_components/iconButton';
import { Button } from '../../_styled_components/button';
import { DisplayHeader } from '../../_styled_components/displayHeader';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import { GameSystemIcons } from '../../_assets/icons';
import { Icon } from '../../_styled_components/displayPage';
import styled from 'styled-components';

interface MatchProps {
    id: string;
}

const NewGamePage: React.FunctionComponent<RouteComponentProps<
    MatchProps
>> = props => {
    const { id } = props.match.params;
    const { history } = props;
    const dispatch = useDispatch();
    const seriesById = useSelector(state => state.series.byId);
    const companiesById = useSelector(state => state.companies.byId);

    const selectedGame = useSelector(state => state.games.byId[id]);
    const initialValues: Game = selectedGame ? selectedGame : defaultGame;

    const handleCancel = async () => {
        await props.history.goBack();
    };

    const handleSubmit = async (props: Game) => {
        id
            ? await dispatch(gameActions.update(id, props))
            : await dispatch(gameActions.create(props));

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
                {id ? `edit ${selectedGame.title}` : `add new game`}
            </DisplayHeader>
            <Formik
                initialValues={initialValues}
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
                    <FormContainer onSubmit={handleSubmit}>
                        <SectionHeader>Game Info</SectionHeader>
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
                            <Field
                                id="genre"
                                name="genre"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.genre}
                                type="text"
                                placeholder="Genre"
                            />
                            <Error>
                                <ErrorMessage name="genre" />
                            </Error>
                            <CheckboxLabel htmlFor="multiplayer">
                                <MultiplayerIcon
                                    checked={values.multiplayer}
                                    src={GameSystemIcons.multiplayer}
                                    alt="multiplayer"
                                />
                            </CheckboxLabel>
                            <Field
                                id="multiplayer"
                                name="multiplayer"
                                type="checkbox"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.multiplayer}
                                checked={values.multiplayer}
                                style={{ appearance: 'none', height: '0' }}
                            />
                            <ErrorMessage name="multiplayer" />
                        </Section>

                        <SectionHeader>Collection Info</SectionHeader>
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
                            <FieldArray
                                name="platforms"
                                render={arrayHelpers => (
                                    <div>
                                        <FieldCollectionLabel>
                                            <Label htmlFor="platforms">
                                                Platforms
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
                                        {values.platforms &&
                                            values.platforms.map(
                                                (platform, index) => (
                                                    <div key={index}>
                                                        <Field
                                                            id={`platforms.${index}`}
                                                            name={`platforms.${index}`}
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            value={
                                                                values.platforms![
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
                                <ErrorMessage name="platforms" />
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
                                                            onBlur={handleBlur}
                                                            onChange={
                                                                handleChange
                                                            }
                                                            type="text"
                                                            autocomplete="language"
                                                            value={
                                                                values.languages![
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
                            <div>
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
                            </div>
                            <Error>
                                <ErrorMessage name="digital" />
                                <ErrorMessage name="physical" />
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
                            />
                            <Error>
                                <ErrorMessage name="image" />
                            </Error>
                        </Section>

                        <Buttons>
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
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    validationErrorExists(errors, touched)
                                }
                            >
                                {id ? 'Edit Game' : 'Add Game'}
                            </Button>
                        </Buttons>
                    </FormContainer>
                )}
            </Formik>
        </Fragment>
    );
};

export default withRouter(NewGamePage);

const MultiplayerIcon = styled(Icon)<{ checked: boolean }>`
    height: 10vh;
    border-radius: 50%;
    border: 3px solid ${props => (props.checked ? 'green' : 'transparent')};

    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;
