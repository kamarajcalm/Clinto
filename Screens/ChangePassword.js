import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView,  TextInput ,ActivityIndicator, KeyboardAvoidingView, Platform,ScrollView} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome, MaterialIcons} from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme ,selectUser} from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
const screenHeight =Dimensions.get("screen").height
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            oldPassword:"",
            newPassword:"",
            secure:true,
            confirmPassword:""
        };
    }
    showSimpleMessage(content, color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor: color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
updatePassword = async()=>{
    this.setState({updating:true})
    if(this.state.oldPassword==""){
            this.setState({updating:false})
        return this.showSimpleMessage("Please Enter Old Password","orange","info")
    }
       if(this.state.newPassword==""){
            this.setState({updating:false})
        return this.showSimpleMessage("Please Enter new Password","orange","info")
    }
    if(this.state.confirmPassword==""){
         this.setState({updating:false})
        return this.showSimpleMessage("Please Enter confirm  Password","orange","info")
    }
      if(this.state.newPassword!=this.state.confirmPassword){
           this.setState({updating:false})
        return this.showSimpleMessage("password Does not matched","orange","info")
    }
   let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
    let sendData ={
      password:this.state.oldPassword,
      newpassword :this.state.newPassword
    }
    let post = await HttpsClient.patch(api,sendData)
   if(post.type=="success"){
         this.setState({updating:false})
         await AsyncStorage.clear()
         this.showSimpleMessage("Password Changed SuccessFully","green","success")
         return this.props.navigation.dispatch(
         CommonActions.reset({
           index: 0,
           routes: [
             {
               name: 'LoginScreen',

             },

           ],
         })
       )
   }
}
    componentDidMount() {
      console.log(this.props.user)
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                     <KeyboardAvoidingView 
                       style={{flex:1}}
                       behavior={Platform.OS=="ios"?"padding":"height"}
                     >

                 
                    <View style={{height:screenHeight }}>
                        <StatusBar backgroundColor={themeColor}/>
                                    {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Change Password</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>
                                
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView 
                                contentContainerStyle={{paddingBottom:90,paddingHorizontal:20}}
                                keyboardShouldPersistTaps ={"handled"}
                                showsVerticalScrollIndicator={false}
                            >
                          
                           
                            
                          
                                <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"gray"}]}>old Password</Text>
                                </View>
                             
                                <TextInput 
                                  value={this.state.oldPassword}
                                            secureTextEntry={true}
                                   autoFocus={true}
                                   style={{height:40,width:"100%",borderBottomColor:"gray",borderBottomWidth:1,color:"#000"}}
                                   onChangeText={(oldPassword)=>{this.setState({oldPassword})}}
                                   selectionColor={"#000"}
                                  
                                />
                           <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"gray"}]}>New Password</Text>
                             </View>
                             <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",borderBottomColor:"gray",borderBottomWidth:1,}}>
                                    <TextInput 
                                      value={this.state.newPassword}
                                    secureTextEntry={true}
                                   style={{height:40,width:"100%",color:"#000"}}
                                   selectionColor={"#000"}
                                      onChangeText={(newPassword)=>{this.setState({newPassword})}}
                                />
     
                             </View>
                             <View style={{marginTop:20}}>
                                    <Text style={[styles.text,{color:"gray"}]}>Confirm New Password</Text>
                             </View>
                             <View style={{flexDirection:"row",borderBottomColor:"gray",borderBottomWidth:1,}}>
                                    <TextInput 
                                      value={this.state.confirmPassword}
                                    secureTextEntry={this.state.secure}
                                   style={{height:40,width:"80%",color:"#000"}}
                                   selectionColor={"#000"}
                                      onChangeText={(confirmPassword)=>{this.setState({confirmPassword})}}
                                />
                                             <TouchableOpacity 
                             onPress={()=>{this.setState({secure:!this.state.secure})}}
                            >
                                    <Entypo name={`${this.state.secure?"eye":"eye-with-line"}`} size={24} color="#000" />
                            </TouchableOpacity>
                             </View>
                                <View style={{alignItems:'center',justifyContent:'center',marginTop:40}}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center" ,backgroundColor:themeColor}}
                                     onPress ={()=>{
                                        this.updatePassword()
                                 
                                    
                                    }}
                                    >
                                       {this.state.updating?<ActivityIndicator size={"large"} color={"#fff"}/>: <Text style={[styles.text,{color:"#fff"}]}>Update</Text>}
                                    </TouchableOpacity>
                                </View>
                                
                            </ScrollView>

                        </View>
                     
                     
                    </View>
                    </KeyboardAvoidingView>
                    <DateTimePickerModal
                        isVisible={this.state.show}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />
                </SafeAreaView>

            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    modalView1: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'flex-end',
        width: width
    }
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme, selectUser })(ChangePassword)

