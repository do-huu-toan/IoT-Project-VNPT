
import * as React from 'react';
import {
    Text,View,SafeAreaView,
    TouchableOpacity,
   } from "react-native";
import anh from "../assets/img/anh.jpg"
import Background from './Background';
import { style_background } from '../assets/css/style_background';
export default function StartScreen({navigation}){
    return(
        
        <View style={{flex:1}}>
            <Background />
            <View style={style_background.form}>
                <Text style={style_background.textForm}>Chào mừng các bạn đến với App</Text>
               
                <TouchableOpacity
                style={style_background.btn}
                onPress={() => navigation.navigate('login')}
                >
                <Text style={style_background.buttonText}>đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={style_background.btn}
                onPress={() => navigation.navigate('đăng kí')}
                >
                <Text style={style_background.buttonText}>đăng kí</Text>
                </TouchableOpacity>
            </View>
            
            
        </View>
    )
}
