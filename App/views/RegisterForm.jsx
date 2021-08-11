import React from "react";
import {
  SafeAreaView,
  View,StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Formik } from "formik";
import { validationSchemaRegister } from "../assets/js/validation";
import { styles } from "../assets/css/style";
import { style_background } from "../assets/css/style_background";
import FormField from "../components/FormField";
import * as SecureStore from 'expo-secure-store';
import Background from "./Background";



export default function RegisterForm({navigation}) {
  
  return (
    <>
      <SafeAreaView  />

      <StatusBar style="light" />

      <SafeAreaView style={{flex:1}}>

        <KeyboardAwareScrollView
          style={{flex:1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={150}
        >
         
          <Formik
            initialValues={{
              userName:"",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            enableReinitialize
            onSubmit={onSubmitHandler}
            validationSchema={validationSchemaRegister}
          >
            {({
              handleChange,handleBlur,handleSubmit,
              values,errors,touched,isValid,
            }) => (
              <>
                <Background/>
                <View style={style_background.form}>
                  <Text style={style_background.textForm}>Đăng ký tài khoản</Text>
                  <FormField
                  field="userName"
                  label="userName"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

              

                <FormField
                  field="email"
                  label="Email Address"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="password"
                  label="Password"
                  secureTextEntry={true}
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="confirmPassword"
                  label="Confirm Password"
                  secureTextEntry={true}
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <TouchableOpacity
                  disabled={!isFormValid(isValid, touched)}
                  onPress={handleSubmit}
                >
                  <View
                    style={[
                      style_background.btn,
                      {
                        opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Text style={style_background.buttonText}>SUBMIT</Text>
                  </View>
                </TouchableOpacity>
                <View style={style_background.row}>
                  <Text style={{color:"#fff"}}>bạn đã có tài khoản</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text style={style_background.link}>đăng nhập</Text>
                  </TouchableOpacity>
                </View>
                </View>
                
                
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
}
async function onSubmitHandler(values) {
  
    await SecureStore.setItemAsync(values.userName,values.password);
  
}

function isFormValid(isValid, touched) {
  return isValid && Object.keys(touched).length !== 0;
}

