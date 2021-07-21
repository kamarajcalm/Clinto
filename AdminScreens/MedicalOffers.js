import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ScrollView,TextInput } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import authAxios from '../api/authAxios';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
const date = new Date()
import { Linking } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
class MedicalOffers extends Component {
    constructor(props) {  
        super(props);
        let item = props.route.params.item
        this.state = {
            item,
            Monthly:"",
            threeMonth:"",
            sixMonth:"",
            edit:false,
            discount:""
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
    componentDidMount() {
        this.setState({ discount: this.state?.item?.discount_percent.toString()})
    }
    save = async()=>{
        let api = `${url}/api/prescription/clinics/${this.state.item.id}/`
        let sendData = {
            discount_percent:this.state.discount

        }
        let patch =await HttpsClient.patch(api,sendData)
        if(patch.type =="success"){
           this.showSimpleMessage("edited successfully","green","success")
           this.setState({edit:false})
        }else{
            this.showSimpleMessage("Try Again", "red", "danger")
        }
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item.companyName}</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2 }}

                            >

                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ flex: 1, }}>
                            {/* image */}
                           
                            <View style={{marginTop:40,alignItems:"center"}}>
                                <View style={{marginLeft:5}}>
                                    <Text style={[styles.text, { color: "#000" }]}>Discount %</Text>
                                </View>
                                <View style={{ marginTop: 10, marginLeft: 20}}>
                                   <TextInput 
                                      keyboardType={"numeric"}
                                      ref ={ref=>this.keyRef=ref}
                                      value={this.state.discount}
                                      editable={this.state.edit}
                                      style={{height:height*0.05,width:width*0.6,backgroundColor:"#fafafa"}}
                                      selectionColor={themeColor}
                                      onChangeText={(discount) => { this.setState({ discount})}}
                                   />
                               </View>
                            </View>
                            {/* <View style={{ marginTop: 10 }}>
                                <View style={{ marginLeft:5 }}>
                                    <Text style={[styles.text, { color: "#000" }]}> Three Month Pack Amount</Text>
                                </View>
                                <View style={{ marginTop: 10, marginLeft: 20}}>
                                    <TextInput
                                        editable={this.state.edit}
                                        style={{ height: height * 0.05, width: width * 0.6, backgroundColor: "#fafafa" }}
                                        selectionColor={themeColor}
                                        onChangeText={(threeMonth) => { this.setState({ threeMonth }) }}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ marginLeft:5}}>
                                    <Text style={[styles.text, { color: "#000" }]}>six Month Pack Amount</Text>
                                </View>
                                <View style={{ marginTop: 10, marginLeft: 20 }}>
                                    <TextInput
                                        editable={this.state.edit}
                                        style={{ height: height * 0.05, width: width * 0.6, backgroundColor: "#fafafa" }}
                                        selectionColor={themeColor}
                                        onChangeText={(sixMonth) => { this.setState({ sixMonth }) }}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <View style={{ marginLeft:5 }}>
                                    <Text style={[styles.text, { color: "#000" }]}>Yearly Amount</Text>
                                </View>
                                <View style={{ marginTop: 10, marginLeft: 20}}>
                                    <TextInput
                                        editable={this.state.edit}
                                        style={{ height: height * 0.05, width: width * 0.6, backgroundColor: "#fafafa" }}
                                        selectionColor={themeColor}
                                        onChangeText={(Yearly) => { this.setState({ Yearly }) }}
                                    />
                                </View>
                            </View> */}

                              <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around",marginTop:50}}>
                                   <TouchableOpacity 
                                     style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:"#333"}}
                                     onPress={()=>{
                                         this.setState({edit:true},()=>{
                                             this.keyRef.focus()
                                         })
                                        }}
                                   >
                                       <Text style={[styles.text,{color:"#fff"}]}>Edit</Text>
                                   </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: "#333" }}
                                     onPress={()=>{this.save()}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Save</Text>
                                </TouchableOpacity>
                              </View>
                        </ScrollView>

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
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(MedicalOffers);