import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, ErrorMessage } from 'formik';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { loginSchema } from '../../../lib/schemas/login.schema';
import { authenticationActions } from '../../_actions';
import { history } from '../../_helpers/history';

interface LoginState {
    username: string;
    password: string;
}

const initialState: LoginState = {
    username: '',
    password: ''
};

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const handleSubmit = async ({ username, password }: LoginState) => {
        await dispatch(authenticationActions.login(username, password));
        history.push('/');
    };

    return (
        <Fragment>
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
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <Field
                            id="username"
                            name="username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            type="text"
                            placeholder="Username"
                        />
                        <ErrorMessage name="username" />

                        <label htmlFor="password">Password:</label>
                        <Field
                            id="password"
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            type="password"
                            placeholder="Password"
                        />
                        <ErrorMessage name="password" />

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                validationErrorExists(errors, touched)
                            }
                        >
                            Login
                        </button>
                    </form>
                )}
            </Formik>
        </Fragment>
    );
};

export default LoginPage;
