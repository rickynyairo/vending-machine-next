"use client";
import React, { useId } from "react";
import { useRouter } from "next/navigation";
import {
  makeStyles,
  Label,
  Input,
  Button,
  Text,
  Card,
} from "@fluentui/react-components";
import * as yup from "yup";
import { useFormik } from "formik";
import ErrorText from "./ErrorText";

const urlPath = () => {
  // if we're in dev or testing, path is local
  // if we're in production, path is deployed url
  if (process.env.NODE_ENV === "production") {
    return "https://vending-machine-next.vercel.app";
  } else {
    return "http://localhost:3000";
  }
};
const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    minWidth: "480px",
  },
  input: {
    marginBottom: "16px",
  },
  button: {
    marginTop: "16px",
  },
  // center the form in the middle of the page
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    height: "100%",
    width: "fit-content",
    alignSelf: "center",
  },
});

export const LoginForm = () => {
  const userNameInputId = useId();
  const passwordInputId = useId();
  const classes = useStyles();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    // Submit the form data to the /login endpoint as a POST request
    try {
      const response = await fetch(`${urlPath()}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 200) {
        // Handle a successful signup response
        // redirect to home page

        console.log("Login successful");
        router.push("/");
      } else {
        // Handle errors or unsuccessful signup response
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
      handleSubmit(values);
    },
  });

  return (
    <Card className={classes.card}>
      <Text as="h1" weight="bold" size={600} align="start">
        Login
      </Text>
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Label htmlFor={userNameInputId} required>
          Username
        </Label>
        <Input
          id={userNameInputId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          name="username"
          placeholder="Your username"
          className={classes.input}
        />
        <ErrorText
          error={formik.errors.username}
          touched={formik.touched.username}
        />
        <Label htmlFor={passwordInputId} required>
          Password
        </Label>
        <Input
          id={passwordInputId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          name="password"
          type="password"
          placeholder="Your password"
          className={classes.input}
        />
        <ErrorText
          error={formik.errors.password}
          touched={formik.touched.password}
        />
        <Button appearance="primary" type="submit" className={classes.input}>
          Login
        </Button>
      </form>
    </Card>
  );
};
