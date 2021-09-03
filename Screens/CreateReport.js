import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar,ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const inputColor = settings.TextInput
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import moment from 'moment';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;

class CreateReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
           name:"",
           price:"",
           reports:[]
        };
    }

   componentDidMount(){
     console.log(this.props.clinic,"cliiii")
   }
       showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
addReport = async()=>{
    let api =`${url}/api/prescription/addReports/`
    let sendData ={
        title:this.state.name,
        price:this.state.price,
        clinic:this.props.clinic.clinicpk
    }
    let post  = await HttpsClient.post(api,sendData)
    if(post.type=="success"){
        this.showSimpleMessage("Report Added SuccessFully","green","success")
        this.props.navigation.goBack()
    }else{
              this.showSimpleMessage("Try Again","red","danger")
    }
}
searchReports = async(name)=>{
   this.setState({name})
   let api =`${url}/api/prescription/reportcategory/?is_verified=true`
   console.log(api)
   let data = await HttpsClient.get(api)
   if(data.type=="success"){
       this.setState({reports:data.data})
   }
}
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />

                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text,{color:"#fff",fontSize:18}]}>Create Report</Text>
                        </View>
                        <View style={{flex:0.2}}>
                             
                        </View>
                    </View>
                    <ScrollView>
                              <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                <Text style={[styles.text], { color:"#000", fontSize: 18 }}>Report Name</Text>
                                <TextInput
                                    maxLength ={10}
                                    value ={this.state.name}
                                    selectionColor={themeColor}
                                    onChangeText={(name) => { this.searchReports(name)}}
                                    style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10}}
                                />
                                                           {this.state.reports.length>0&&<ScrollView 
                        showsVerticalScrollIndicator ={false}
                                style={{
                                    width: width * 0.7, backgroundColor: '#fafafa', borderColor: "#333", borderTopWidth: 0.5
                                 
                                   }}>
                           {
                               this.state.reports.map((i,index)=>{
                                   return(
                                       <TouchableOpacity 
                                           key ={index}
                                           style={{padding:15,justifyContent:"center",width:width*0.7,borderColor:"#333",borderBottomWidth:0.3,height:35}}
                                           onPress={() => { this.setState({ name:i.title,reports:[]},()=>{
                                           })}}
                                       >
                                           <Text style={[styles.text,{color:themeColor,}]}>{i.title}</Text>
                                       </TouchableOpacity>
                                   )
                               })
                           }
                        </ScrollView>}
                               </View>
            
                                    <View style={{ marginTop: 20 ,paddingHorizontal:20}}>
                                <Text style={[styles.text], { color:"#000", fontSize: 18 }}>Report Price</Text>
                                <TextInput
                                    maxLength ={10}
                                    value ={this.state.price}
                                    selectionColor={themeColor}
                                    keyboardType="numeric"
                                    onChangeText={(price) => { this.setState({price})}}
                                            style={{ width: width * 0.7, height: 35, backgroundColor: inputColor, borderRadius: 10, padding: 10, marginTop: 10}}
                                />
                               </View>
                               <View style={{ marginTop: 20 ,paddingHorizontal:20,alignItems:"center",justifyContent:"center"}}>
                                      <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:10}}
                                        onPress={()=>{this.addReport()}}
                                      >

                                              <Text style={[styles.text,{color:"#fff"}]}>Add</Text>
                                        </TouchableOpacity>   
                               </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
    }

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(CreateReport);