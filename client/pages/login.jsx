import { useMutation, useApolloClient } from "@apollo/react-hooks";
import USER_LOGIN_QUERY from "../grapghql/mutation/login";
import MainLayout from "../components/MainLayout";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import cookie from "cookie";
import redirect from "../lib/redirect";
import { FormikTextField } from "formik-material-fields";
import { Button, LinearProgress } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default function Login() {
  const client = useApolloClient();

  const [errors, seterrors] = useState([{}]);

  const onCompleted = data => {
    seterrors(errors => []);

    // Store the token in cookie
    document.cookie = cookie.serialize("token", data.login.token, {
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    // Force a reload of all the current queries now that the user is
    // logged in
    client.cache.reset().then(() => {
      redirect({}, "/");
    });
  };
  const onError = error => {
    seterrors(errors => errors.concat(error.graphQLErrors[0].message));
  };
  const [create, { loading }] = useMutation(USER_LOGIN_QUERY, {
    onCompleted,
    onError
  });

  if (loading)
    return (
      <>
        <LinearProgress />
      </>
    );

  return (
    <MainLayout isAuth={false} title="Login">
      <div className="login-form">
        {errors.length > 1 ? (
          <Alert severity="error">{errors[errors.length - 1]}</Alert>
        ) : null}
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            create({
              variables: {
                email: values.email,
                password: values.password
              }
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormikTextField
                type="email"
                name="email"
                label="Email"
                margin="normal"
                fullWidth
              />
              <FormikTextField
                type="password"
                name="password"
                label="Password"
                margin="normal"
                fullWidth
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </MainLayout>
  );
}
