import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { Formik, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { loginSchema } from '../../../lib/schemas/login.schema';
import { authenticationActions } from '../../_actions';
import { history } from '../../_helpers/history';
import { Button } from '../../_styled_components/button';
import { SectionHeader } from '../../_styled_components/sectionHeader';
import {
    Error,
    FormHeader,
    FormContainer,
    Section,
    Buttons,
    StyledField as Field
} from '../../_styled_components/formElements';

interface LoginState {
    username: string;
    password: string;
}

const initialState: LoginState = {
    username: '',
    password: ''
};

const LoginPage: React.FunctionComponent<RouteComponentProps> = props => {
    const dispatch = useDispatch();
    const handleSubmit = async ({ username, password }: LoginState) => {
        await dispatch(authenticationActions.login(username, password));
        history.push('/');
    };

    return (
        <Fragment>
            <FormHeader>Login</FormHeader>
            <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={loginSchema}
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
                                Login
                            </Button>
                        </Buttons>
                    </FormContainer>
                )}
            </Formik>
            <SectionHeader />
            <Buttons>
                <Button
                    onClick={() => props.history.push('/register')}
                    style={{
                        borderColor: 'lightgrey',
                        backgroundColor: 'lightgrey'
                    }}
                >
                    Create a New Account
                </Button>
            </Buttons>
        </Fragment>
    );
};

export default withRouter(LoginPage);
