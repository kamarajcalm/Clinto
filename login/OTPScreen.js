import React, { Component } from 'react';
import { View, Text, Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, AsyncStorage, KeyboardAvoidingView,} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { AntDesign,Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
const { height, width } = Dimensions.get("window");
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const screenHeight =  Dimensions.get("screen").height
class OTPScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
login =async()=>{
    let login = await AsyncStorage.setItem('login','true')
    return this.props.navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                {
                    name: 'MainTab',

                },

            ],
        })
    )
    
}
verifyOTP =()=>{
   this.props.navigation.navigate("CreatePassword")
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
                                <Text style={[styles.text,{color:"#fff",fontSize:height*0.04,fontWeight:"bold"}]}>Verify OTP</Text>
                              </View>
                                <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"gray"}]}>Pin</Text>
                                </View>
                             
                                <TextInput 
                                   autoFocus={true}
                                   style={{height:40,width:"100%",borderBottomColor:"gray",borderBottomWidth:1,color:"#fff"}}
                                   keyboardType={"numeric"}
                                   selectionColor={"#fff"}
                                   maxLength={4}
                                />

                                <View style={{marginTop:40,alignItems:"center",justifyContent:"center"}}>
                                        <TouchableOpacity style={{height:height*0.05,width:width*0.9,backgroundColor:"#fff",alignItems:"center",justifyContent:"center"}}
                                         onPress={()=>{this.verifyOTP()}}
                                        >
                                               <Text style={[styles.text]}>Confirm</Text>
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
    },
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(OTPScreen);