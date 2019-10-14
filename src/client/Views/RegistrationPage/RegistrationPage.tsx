import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Field, ErrorMessage } from 'formik';
import { User } from '../../_interfaces';
import { userSchema } from '../../../lib/schemas';
import { userActions } from '../../_actions';
import { validationErrorExists } from '../../_helpers/validationErrorExists';
import { history } from '../../_helpers/history';

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

                        <label htmlFor="email">Email:</label>
                        <Field
                            id="email"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            type="email"
                            placeholder="E-mail"
                        />
                        <ErrorMessage name="email" />

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
                            Submit
                        </button>
                    </form>
                )}
            </Formik>
        </Fragment>
    );
};

export default RegistrationPage;
