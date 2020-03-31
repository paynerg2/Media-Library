import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import { User } from '../../_interfaces';
import { userSchema } from '../../../lib/schemas';
import { userActions } from '../../_actions';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { history } from '../../_helpers/history';
import { Button } from '../../_styled_components/button';
import {
    Error,
    FormHeader,
    FormContainer,
    Section,
    Buttons,
    StyledField as Field
} from '../../_styled_components/formElements';

const initialState: User = {
    username: '',
    email: '',
    password: ''
};

const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch();
    const handleSubmit = (values: User) => {
        try {
            dispatch(userActions.create(values));
            history.push('/login');
        } catch (err) {
            console.log(err);
            // TODO: Probably a usecase for a generic page alert state
        }
    };
    return (
        <Fragment>
            <FormHeader>Create New Account</FormHeader>
            <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={userSchema}
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
                        <Section>
                            <Field
                                id="username"
                                name="username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                type="text"
                                placeholder="Username"
                            />
                            <Error>
                                <ErrorMessage name="username" />
                            </Error>

                            <Field
                                id="email"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                type="email"
                                placeholder="E-mail"
                            />
                            <Error>
                                <ErrorMessage name="email" />
                            </Error>

                            <Field
                                id="password"
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                type="password"
                                placeholder="Password"
                            />
                            <Error>
                                <ErrorMessage name="password" />
                            </Error>
                        </Section>

                        <Buttons>
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    validationErrorExists(errors, touched)
                                }
                            >
                                Submit
                            </Button>
                        </Buttons>
                    </FormContainer>
                )}
            </Formik>
        </Fragment>
    );
};

export default RegistrationPage;
