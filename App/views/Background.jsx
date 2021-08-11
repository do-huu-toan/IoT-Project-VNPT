
import * as React from 'react';
import {Image,Dimensions,Platform ,
    } from "react-native";
import anh from "../assets/img/anh.jpg"

export default function Background(){
    return(
    <Image style={{
        zIndex:-1,
        width: Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        resizeMode:"cover",
    }}
               source={anh} 
            >
    </Image>
    )
}
