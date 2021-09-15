import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, TextInput, ActivityIndicator ,FlatList,KeyboardAvoidingView, Platform} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme, selectUser } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import { ScrollView, } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
class EditHeathIssues extends Component {
    constructor(props) {
         let item = props?.route?.params?.item||[]
        super(props);
        this.state = {
            updating:false,
            item,
            healthIssue:""
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
    getSelfMode = async () => {
        const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`);
        if (data.type == "success") {
            this.props.selectUser(data.data[0]);
            this.showSimpleMessage("Health Issue Successfully", "green", "success")
            return this.setState({ updating: false })
        }


    }
    updateProfile = async () => {
        this.setState({ updating: true })
 
        let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
        let sendData = {
            health_issues:this.state.item

        }
 
        let patch = await HttpsClient.patch(api, sendData)
          console.log(patch)

        if (patch.type == "success") {
            this.getSelfMode()


        } else {
            this.showSimpleMessage("Try Again", "red", "danger")
            this.setState({ updating: false })
        }
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

    componentDidMount() {
       
    }
    removeItem =(item,index)=>{
        let duplicate = this.state.item
        duplicate.splice(index,1)
        this.setState({ item:duplicate})
    }
    add =()=>{
         if(this.state.healthIssue ==""){
             return this.showSimpleMessage("health Issue should not be Empty","orange","info")
         }
        let duplicate = this.state.item
 
        duplicate.push(this.state.healthIssue)
        this.setState({ item: duplicate, healthIssue:""})
    }
    renderFooter = ()=>{
        return(
            <View style={{marginVertical:20,alignItems:"center"}}>
                    <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,}}
                     onPress ={()=>{this.updateProfile()}}
                    >
                     {this.state.updating?<ActivityIndicator  color={"#fff"} size={"large"}/> :  <Text style ={[styles.text,{color:'#fff'}]}>Update</Text>}
                    </TouchableOpacity>
            </View>
        )
    }
    header =()=>{
        return(
            <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                         <Text style={[styles.text,{color:"#000"}]}>#</Text>
                    </View>
                    <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text,{color:"#000"}]}>Issue</Text>
                    </View>
   
                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text,{color:"#000"}]}>Action</Text>
                    </View>
            </View>
        )
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor:"#fff"}}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor,  justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Edit Health Issues</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                          <View style={[styles.boxWithShadow,{height:height*0.08,width,backgroundColor:"#333",alignItems:"center",justifyContent:"space-around",flexDirection:"row"}]}>
                                <TextInput
                                  value ={this.state.healthIssue}
                                  style={{height:35,width:"70%",backgroundColor:"#fff",paddingLeft:10,borderRadius:5}}
                                  selectionColor={themeColor}
                                  onChangeText={(healthIssue) => { this.setState({ healthIssue})}}
                                
                                />
                                <TouchableOpacity style={{height:height*0.06,width:'20%',alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                  onPress ={()=>{this.add()}}
                                >
                                        <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                                </TouchableOpacity>
                            </View>
                       
                            <FlatList
                               ListHeaderComponent={this.header}
                               ListFooterComponent ={this.renderFooter()} 
                               contentContainerStyle={{}}
                               data={this.state.item}
                               keyExtractor= {(item,index)=>index.toString()}
                               renderItem ={({item,index})=>{
                                    return(
                           <View style={{flexDirection:"row",marginTop:5}}>
                                    <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:"#000"}]}>{index+1}</Text>
                                    </View>
                                    <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={[styles.text,{color:"#000"}]}>{item}</Text>
                                    </View>
                
                                    <TouchableOpacity style={{flex:0.2,alignItems:"center",justifyContent:"center"}}
                                     onPress ={()=>{
                                         this.removeItem(item,index)
                                     }}
                                    >
                                         <AntDesign name="delete" size={24} color="red" />
                                    </TouchableOpacity>
                            </View>
                                                    )
                              }}
                            />
                 
                        </View>

              


                
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
    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme, selectUser })(EditHeathIssues)