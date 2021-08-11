import { StyleSheet, Platform, Dimensions } from "react-native";
import Constants from "expo-constants";
const text = {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
}
export const style_background = StyleSheet.create({
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#e3e3e3",
        backgroundColor: "#fff",
        textAlign: "center"
    },
    form: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 12,
        top: 0,
        position: "absolute",
        justifyContent: "center",
    },
    btn: {
        marginTop: 20,
        backgroundColor: "#2980b9",
        padding: 15,
        borderRadius: 15,

    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    textForm: {
        ...text,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: 'row',
        margin: 12,
    },
    forgot: {
        alignItems: "flex-end",
        marginRight: 12,
        marginTop: 16,

    },
    link: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
        color: "#fff"
    },
})