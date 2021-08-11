import React,{useState} from "react";
import { TouchableNativeFeedback,KeyboardAvoidingView ,View,Text,TouchableOpacity, Keyboard} from "react-native";
import { Formik } from 'formik';
import { validationSchemaForgot } from "../assets/js/validation";
import FormField from "../components/FormField";
import { style_background } from "../assets/css/style_background";
import Background from "./Background";
import * as SecureStore from 'expo-secure-store';

export default function ForgotForm({navigation}){
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:1 ,justifyContent:"center"}}
        >
            <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <View style={{flex:1,justifyContent:"center",}}>
                <Formik
                    initialValues={{          
                        email:""
                      }}
                      enableReinitialize
                      onSubmit={onSubmitHandler}
                      validationSchema={validationSchemaForgot}
                >
                    {({
                        handleChange,handleBlur,handleSubmit,
                        values,errors,touched,isValid,
                    }) => ( 
                            <View style={{flex:1}}>
                                <Background />
                                <View style={style_background.form}>
                                    <Text style={style_background.textForm}>Quên Mật khẩu</Text>
                                    <View >
                                        
                                        <FormField 
                                            field="email"
                                            label="nhập email của bạn"
                                            autoCapitalize="words"
                                            values={values}
                                            touched={touched}
                                            errors={errors}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                        />
                                    </View>
                                    <Text style={{fontSize:12,color:"#fff"}}>
                                        bạn sẽ nhận được đường dẫn làm mới mật khẩu ở email
                                    </Text>
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
                                </View>
                                
                            </View>
                    )}
                    
                </Formik>
            </View> 
            </TouchableNativeFeedback>
            
        </KeyboardAvoidingView>
        
    )
}
async function onSubmitHandler(values) {
      
    await SecureStore.setItemAsync("Nam11",JSON.stringify(values));
  
}
function isFormValid(isValid, touched) {
    return isValid && Object.keys(touched).length !== 0;
}