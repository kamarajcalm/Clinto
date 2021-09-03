import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, TextInput, ActivityIndicator} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons,AntDesign } from '@expo/vector-icons';
import authAxios from '../api/authAxios';
import HttpsClient from '../api/HttpsClient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url
import Modal from 'react-native-modal';
import SimpleToast from 'react-native-simple-toast';
import { LinearGradient } from 'expo-linear-gradient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const screenHeight = Dimensions.get("screen").height
class AddDiagnosisCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
             category:"",
             creating:false
        };
    }

    componentDidMount() {
      

    }
    componentWillUnmount() {
 
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
  addCategory = async()=>{
    // this.setState({creating:true})
    if(this.state.category==""){
      this.setState({creating:false})
       return this.showSimpleMessage("please add Category","orange","info")
    }
    let api =`${url}/api/prescription/reportcategory/`
    let sendData ={
      title:this.state.category,
      is_verified:true
    }
 
    let post  = await HttpsClient.post(api,sendData)
    console.log(post)
    if(post.type=="success"){
        this.setState({creating:false})
         this.showSimpleMessage("Added successFully","green","success")
         return this.props.navigation.goBack();
    }else{
              this.setState({creating:false})
      this.showSimpleMessage("Try Again","red","danger")
    }
  }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                     <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff',  fontSize: height*0.02}]}>Add Category</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2 }}

                            >

                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <View style={{paddingHorizontal:20}}>
                                  <View style={{marginTop:10}}>
                                       <Text style={[styles.text,{color:'#000',fontSize:height*0.02}]}>Enter Categories Name</Text>
                                  </View>
                                 <TextInput 
                                    
                                    selectionColor={themeColor}
                                    value={this.state.category}
                                    onChangeText={(category)=>{this.setState({category})}}
                                    style={{height:35,width:width*0.8,backgroundColor:"#fafafa",borderRadius:5,paddingLeft:10,marginTop:10}}
                                 
                                 />
                            </View>
                            <View style={{marginTop:30,alignItems:"center",justifyContent:"center"}}>
                              {!this.state.creating?  <TouchableOpacity
                                  onPress={()=>{this.addCategory()}}
                                  style={{height:height*0.04,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5,width:width*0.3}}
                                >
                                     <Text style={[styles.text,{color:'#fff'}]}>Add</Text>
                                </TouchableOpacity>:
                                <View>
                                     <ActivityIndicator  size={"large"} color={themeColor}/>
                                </View>
                                }
                            </View>
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(AddDiagnosisCategories);