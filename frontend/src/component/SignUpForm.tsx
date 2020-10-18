import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../CSSsource/SignupPage.css';
import AuthService from '../service/AuthService';

export const SignUp = () => {
    const history = useHistory();

    return (
        <Formik
            initialValues = {{ account: '', email: '', password: '', conPass: '' }}
            onSubmit = { async (values, actions) => {
                const result = await AuthService.SignupUser(values.account, (values.email).concat('@ku.th'), values.password, values.conPass);
                // if (!result) {
                //     setSignUpErrorMessage('Sign up error: please type all requirement');
                // } else {
                //     setSignUpErrorMessage('');
                    history.push('/SignUp/AuthenSignup');
                // };
                actions.setSubmitting(false);
            }} 
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className="signup-account-name_">
                        Account Name :
                    <Field type="input" name="account" placeholder="Type your username... (Only characters and numbers allowed.)" style={{ width: "770px", height: "50px" }} className="signup-Input_account" />
                    </div>
                    <div className="signup-email_">
                        Email :
                    <Field type="input" name="email" placeholder="Type your Email..." style={{ width: "750px", height: "50px" }} className="signup-Input_email" />
                    </div>
                    <div className="signup-_ku-th">
                        @ku.th
                    </div>
                    <div className="signup-password_">
                        Password :
                    <Field type="password" name="password" placeholder="Type your password..." style={{ width: "855px", height: "50px" }} className="signup-Input_password" />
                    </div>
                    <div className="signup-cf-password">
                        Confirm Password :
                    <Field type="password" name="conPass" placeholder="Confirm your password..." style={{ width: "675px", height: "50px" }} className="signup-Input-cf-password" />
                    </div>
                    <div className="signup-sign-up">
                        <button disabled={ isSubmitting } className="signup-su-frame">
                            <button className="signup-square"></button>
                            &nbsp; &nbsp; Sign Up
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};