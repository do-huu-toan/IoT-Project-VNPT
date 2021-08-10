import React,{useState} from "react";
import {KeyboardAvoidingView,TouchableWithoutFeedback,
    Keyboard, StyleSheet,Text,View,SafeAreaView,
    TouchableOpacity,TextInput ,Image,Dimensions,Platform ,
    Switch,Button} from "react-native";
import  Constants  from "expo-constants";
import { StatusBar } from 'expo-status-bar';
import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import { Formik } from 'formik';
import { validationSchemaLogin } from "../assets/js/validation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormField from "../components/FormField";
import { styles } from "../assets/css/style";
import * as SecureStore from 'expo-secure-store';



async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    result=JSON.parse(result)
    alert("🔐 Here's your value 🔐 \n" + result.password);
  } else {
    alert('No values stored under that key.');
  }
}
export default function LoginForm() {
  async function onSubmitHandler(values) {
  
    await SecureStore.setItemAsync("Nam11",JSON.stringify(values));
  
}
  
    function isFormValid(isValid, touched) {
      return isValid && Object.keys(touched).length !== 0;
    }
  
    return (
      <>
        <SafeAreaView style={styles.topSafeArea} />
  
        <StatusBar style="light" />
  
        <SafeAreaView style={{flex:1,justifyContent:"center"}}>
          <View style={styles.header}>
            <Text style={styles.headerText}>login</Text>
          </View>
  
      
          <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex:1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1,justifyContent:"center",padding:24,}}>
        <Formik
            initialValues={{
              
              password: "",
              userName: "",
            }}
            enableReinitialize
            onSubmit={onSubmitHandler}
            validationSchema={validationSchemaLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <>
                <TextInput
                  style={styles.textInput}
                  onSubmitEditing={event => {
                    getValueFor(event.nativeEvent.text);
                  }}
                  placeholder="Enter the key for the value you want to get"
                />
                <FormField
                    style={styles.input}
                  field="userName"
                  label="tên đăng nhập"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />
                <FormField
                  field="password"
                  label="nhập mật khẩu"
                  autoCapitalize="words"
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
                      styles.button,
                      {
                        opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                      },
                    ]}
                  >
                    <Text style={styles.buttonText}>SUBMIT</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    );
  }