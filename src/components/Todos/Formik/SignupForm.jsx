import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import MyTextInput from "./MyTextInput";
import MySelect from "./MySelect";
import MyCheckbox from "./MyCheckbox";
import { Persist } from "formik-persist";
import MyRadio from "./MyRadio";

function SignupForm() {
  const [formValues, setFormValues] = useState({});
  return (
    <>
      <h1>Subscribe1</h1>
      <Formik
        initialValues={{
          firstName: "1",
          lastName: "",
          email: "",
          acceptedTerms: false, // added for our checkbox
          jobType: "", // added for our select
          gender: "",
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required"),
          lastName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required"),
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          acceptedTerms: Yup.boolean()
            .required("Required")
            .oneOf([true], "You must accept the terms and conditions."),
          jobType: Yup.string()
            .oneOf(
              ["designer", "developer", "product", "other"],
              "Invalid Job Type"
            )
            .required("Required"),
          gender: Yup.string()
            .oneOf(["male", "female", "nonBinary"], "Invalid Gender")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setFormValues({ ...values, id: Date.now() });

          setSubmitting(false);
        }}
        onChange={() => {
          console.log("change");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <MyTextInput
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Jane"
            />

            <MyTextInput
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Doe"
            />

            <MyTextInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="jane@formik.com"
            />

            <MySelect label="Job Type" name="jobType">
              <option value="">Select a job type</option>
              <option value="designer">Designer</option>
              <option value="developer">Developer</option>
              <option value="product">Product Manager</option>
              <option value="other">Other</option>
            </MySelect>

            <MySelect label="Gender" name="gender">
              <option value="" disabled>
                Gender
              </option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="nonBinary">nonBinary</option>
            </MySelect>

            <MyCheckbox name="acceptedTerms">
              I accept the terms and conditions
            </MyCheckbox>

            <MyCheckbox name="color" value="red">
              red
            </MyCheckbox>
            <MyCheckbox name="color" value="blue">
              blue
            </MyCheckbox>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <MyRadio name="isit" value="true">
                true
              </MyRadio>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <MyRadio name="isit" value="false">
                false
              </MyRadio>
              <MyRadio name="isit" value="donno">
                donno
              </MyRadio>
            </div>

            <button type="submit">Submit</button>
            <button type="reset" disabled={!formValues?.lastName}>
              Reset
            </button>
            <Persist name="signup-form" debounce="600" />
          </Form>
        )}
      </Formik>
    </>
  );
}

export default SignupForm;
