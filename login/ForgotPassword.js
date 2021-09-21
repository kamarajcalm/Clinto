import React, { Component } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform, } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { AntDesign, Entypo ,Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
const { height, width } = Dimensions.get("window");
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const screenHeight =  Dimensions.get("screen").height
import Constants from 'expo-constants';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNO: "7010117137",
            password: 'kamaraj',
        };
    }
    sendOTP = () => {
        // this.setState({loading:true})

        this.props.navigation.navigate('OTPScreen')
    }
    render() {
        return (
          <View style={{height:screenHeight,backgroundColor:"#000",marginTop:Platform.OS=="ios"?Constants.statusBarHeight:0}}>
                <View style={{height:"50%",}}>
                        <TouchableOpacity style={{marginLeft:20,marginVertical:20}}
                  onPress={()=>{this.props.navigation.goBack()}}
                >
                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                </TouchableOpacity>
                        <View style={{height:"100%",justifyContent:"center",paddingHorizontal:20}}>
                              <View>
                                <Text style={[styles.text,{color:"#fff",fontSize:height*0.04,fontWeight:"bold"}]}>Enter Mobile Number</Text>
                              </View>
                                <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"gray"}]}>Phone</Text>
                                </View>
                             
                                <TextInput 
                                   autoFocus={true}
                                   style={{height:40,width:"100%",borderBottomColor:"gray",borderBottomWidth:1,color:"#fff"}}
                                   keyboardType={"numeric"}
                                   selectionColor={"#fff"}
                                   maxLength={10}
                                />

                                <View style={{marginTop:40,alignItems:"center",justifyContent:"center"}}>
                                        <TouchableOpacity style={{height:height*0.05,width:width*0.9,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}
                                         onPress={()=>{this.sendOTP()}}
                                        >
                                               <Text style={[styles.text]}>Send OTP</Text>
                                        </TouchableOpacity>
                                </View>
                        </View>
                </View>
                <View style={{height:"50%",}}>

                </View>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    container: {
        flex: 1,
        backgroundColor: themeColor
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30

    },
    text_header: {
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: "#05375a",
        fontSize: 18
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: "#05375a"
    }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(ForgotPassword);