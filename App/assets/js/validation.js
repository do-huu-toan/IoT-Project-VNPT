import * as Yup from "yup";

// https://github.com/jquense/yup
export const validationSchemaRegister = Yup.object().shape({
    userName: Yup.string().required("First Name is required"),

    email: Yup.string()
        .email("Enter a valid email")
        .required("Please enter a registered email"),
    password: Yup.string()
        .required("Please enter a password")
        .min(6, "Password must have at least 6 characters"),
    confirmPassword: Yup.string()
        .required("Please confirm password")
        .oneOf([Yup.ref("password")], "Password & Confirm Password does not match"),
});
export const validationSchemaLogin = Yup.object().shape({

    userName: Yup.string().required("userName is required"),

    password: Yup.string()
        .required("Please enter a password")
        .min(6, "Password must have at least 6 characters"),

});
export const validationSchemaForgot = Yup.object().shape({

    email: Yup.string()
        .email("Enter a valid email")
        .required("Please enter a registered email"),
});