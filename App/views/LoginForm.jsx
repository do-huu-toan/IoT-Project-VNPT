import React,{useState} from "react";
import {KeyboardAvoidingView,TouchableWithoutFeedback,
    Keyboard, StyleSheet,Text,View,SafeAreaView,
    TouchableOpacity,TextInput ,Image,Dimensions,Platform ,
    Switch,Button} from "react-native";
import  Constants  from "expo-constants";
import { style_background } from "../assets/css/style_background";
import { StatusBar } from 'expo-status-bar';
import { Ionicons,FontAwesome5 } from '@expo/vector-icons';
import { Formik } from 'formik';
import { validationSchemaLogin } from "../assets/js/validation";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FormField from "../components/FormField";

import * as SecureStore from 'expo-secure-store';
import Background from "./Background";




async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    result=JSON.parse(result)
    alert("🔐 Here's your value 🔐 \n" + result.password);
  } else {
    alert('No values stored under that key.');
  }
}
export default function LoginForm({navigation}) {
    async function onSubmitHandler(values) {
      
        await SecureStore.setItemAsync("Nam11",JSON.stringify(values));
      
    }
      
    function isFormValid(isValid, touched) {
      return isValid && Object.keys(touched).length !== 0;
    }
  
    return (
      <>
        <SafeAreaView  />
  
        <StatusBar style="light" />
        <SafeAreaView style={{flex:1}}>  
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{flex:1}}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{flex:1,justifyContent:"center"}}>
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
                    handleChange,handleBlur,handleSubmit,
                    values,errors,touched,isValid,
                  }) => (
                    <> 
                      <Background />
                      <View style={style_background.form}>
                      <Text style={style_background.textForm}>Đăng nhập</Text>
                        {/* <TextInput
                        onSubmitEditing={event => {
                          getValueFor(event.nativeEvent.text);
                        }}
                        placeholder="Enter the key for the value you want to get"
                      /> */}
                      <FormField
                          style={style_background.input}
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
                            style_background.btn,
                            {
                              opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                            },
                          ]}
                        >
                          <Text style={style_background.buttonText}>SUBMIT</Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={style_background.forgot }
                       onPress={() => navigation.navigate('forgotForm')}>
                          <Text style={style_background.link}>Quên mật khẩu</Text>
                        </TouchableOpacity>
                      <View style={style_background.row}>
                        
                        <Text style={{color:"#fff"}}>bạn chưa có tài khoản</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('đăng kí')}>
                          <Text style={style_background.link}>đăng kí</Text>
                        </TouchableOpacity>
                      </View>
                      </View>
                      
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
  