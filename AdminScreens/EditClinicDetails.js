import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList, TextInput } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const screenHeight = Dimensions.get("screen").height
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url = settings.url;
import { connect } from 'react-redux';
import { selectTheme, selectClinic, selectUser } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
class EditClinicDetails extends Component {
    constructor(props) {
        let item =props.route.params.clinic
        super(props);
        this.state = {
            item,
            address: item.address,
            latitude: item.lat,
            longitude: item.long,
            clinicName: item.companyName,
            mobile: item.mobile,
            pincode: item.pincode,
            state: item.state,
            city: item.city,
            firstEmergencyContactNo: item.firstEmergencyContactNo ,
            secondEmergencyContactNo: item.secondEmergencyContactNo,
        };
    }
    updateClinic =async()=>{
        
        if (this.state.clinicName == "") {
            return this.showSimpleMessage("Please fill clinicName", "#dd7030",)

        }
        if (this.state.mobile == "") {
            return this.showSimpleMessage("Please fill mobile", "#dd7030",)
        }
        if (this.state.mobile.length<10) {
            return this.showSimpleMessage("Mobile Number should be 10 digits", "#dd7030",)
        }
        if (this.state.pincode == "") {
            return this.showSimpleMessage("Please fill pincode", "#dd7030",)
        }
        if (this.state.address == "") {
            return this.showSimpleMessage("Please fill address", "#dd7030",)
        }
        if (this.state.city == "") {
            return this.showSimpleMessage("Please fill city", "#dd7030",)

        }
        if (this.state.state == "") {
            return this.showSimpleMessage("Please fill state", "#dd7030",)

        }
        if (this.state.latitude == "") {
            return this.showSimpleMessage("Please fill latitude", "#dd7030",)
        }
        if (this.state.longitude == "") {
            return this.showSimpleMessage("Please fill longitude", "#dd7030",)
        }
        let api = `${url}/api/prescription/clinics/${this.state.item.id}/`
        let sendData = {
            displayPicture: this.state.image,
            mobile: this.state.mobile,
            companyName: this.state.clinicName,
            address: this.state.address,
            pincode: this.state.pincode,
            state: this.state.state,
            city: this.state.city,
            firstEmergencyContactNo: this.state.firstEmergencyContactNo,
            secondEmergencyContactNo: this.state.secondEmergencyContactNo,
            lat: this.state.latitude,
            long: this.state.longitude,

        }
        if (this.state.image) {
            sendData.bodyType = "formData"
        }
        let patch = await HttpsClient.patch(api,sendData)
       if(patch.type =="success"){
           this.showSimpleMessage("Updated SuccessFully", "#00A300", "success")
           return this.props.navigation.goBack()
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
  componentDidMount(){
      console.log(this.state.item)
  }
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        });
        if (result.cancelled == true) {
            return
        }
        let filename = result.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        var type = match ? `image/${match[1]}` : `image`;
        const photo = {
            uri: result.uri,
            type: type,
            name: filename,
        };
        this.setState({ openImageModal: false })
        this.setState({ image: photo, changedImage: true })
    };
    modalAttach = async (event) => {
        if (event == 'gallery') return this._pickImage();
        if (event == 'camera') {
            this.handlePhoto()
        }
    }
    handlePhoto = async () => {
        let picture = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.1,
        });
        if (picture.cancelled == true) {
            return
        }

        let filename = picture.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const photo = {
            uri: picture.uri,
            type: type,
            name: filename,
        };
        this.setState({ openImageModal: false })
        this.setState({ image: photo, changedImage: true })
    }
    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.openImageModal}
                hasBackdrop={true}
                style={[styles.modalView1, { position: 'absolute', bottom: -20, left: 0, }]}
                onBackdropPress={() => { this.setState({ openImageModal: false }); }} useNativeDriver={true} onRequestClose={() => { this.setState({ openImageModal: false }); }} >
                <View style={{ paddingVertical: width * 0.01, }}>
                    <View style={{
                        flexDirection: 'row', height: width * 0.25, justifyContent: 'space-between',
                        borderWidth: 0, backgroundColor: 'transparent', borderRadius: 0, paddingTop: width * 0.05
                    }}>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingHorizontal: 4,
                                paddingVertical: 6, borderWidth: 0, borderRadius: 0
                            }}
                            onPress={() => { this.modalAttach('gallery') }}>
                            <FontAwesome
                                name="folder"
                                size={width * 0.16}
                                style={{
                                    marginRight: 5, color: themeColor,
                                    textAlign: 'center', marginLeft: width * 0.1
                                }} />
                            <Text style={{ fontSize: 16, color: themeColor, textAlign: 'center', marginLeft: width * 0.1 }}>Gallary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingHorizontal: 4, paddingVertical: 6, borderWidth: 0, borderRadius: 0, }}
                            onPress={() => { this.modalAttach('camera') }}>
                            <FontAwesome name="camera" size={width * 0.14} style={{ marginRight: 5, color: themeColor, textAlign: 'center', marginRight: width * 0.1 }} />
                            <Text style={{ fontSize: 16, color: themeColor, textAlign: 'center', marginRight: width * 0.1 }}>camera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    render() {
        let dp =""
        if(this.state.item.displayPicture){
            dp = this.state.item.displayPicture
        }
            this.state?.image?.uri
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                        {/* HEADERSS */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Edit Detail</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.navigate('UpdateTimings', { item:this.state.item,})}}
                        >
                           
                                <Entypo name="back-in-time" size={24} color="#fff" />
                                <Text style={[styles.text,{color:"#fff",marginLeft:3}]}>Timings</Text>
                   
                        </TouchableOpacity>
                    </View>
                         {/* CONTENTS */}

                     <ScrollView 
                        showsVerticalScrollIndicator={false}
                        style={{ margin: 20 }}
                     >

                        <View style={{ alignItems: 'center', justifyContent: "center"}}>
                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10, flexDirection: "row", marginLeft: 10 }}>
                                <Image
                                    source={{ uri: this.state?.image?.uri|| dp || "https://img.icons8.com/cotton/2x/clinic.png" }}
                                    style={{ height: 60, width: 60, borderRadius: 30, borderColor: "gray", borderWidth: 1, resizeMode: "cover" }}
                                />
                                <TouchableOpacity style={{}}
                                    onPress={() => { this.setState({ openImageModal: true, }) }}
                                >
                                    <Entypo name="edit" size={20} color={themeColor} />
                                </TouchableOpacity>
                            
                                
                            </View>
                           
                             <View style={{alignItems:'center',justifyContent:"center",marginTop:10}}>
                                <Text style={[styles.text,{color:"#000"}]}>DisplayPicture</Text>
                             </View>
                           
                        
                         </View>
                        <View style={{marginTop:20}}>
                            <Text style={styles.text}>Clinic Name</Text>
                            <TextInput

                                value={this.state.clinicName}
                                onChangeText={(clinicName) => { this.setState({ clinicName }) }}
                                selectionColor={themeColor}
                                style={{ width:"100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee",  paddingLeft: 10 ,marginTop:5}}
                            />
                        </View>
                               {/* ADDRESS */}

                        <View style={{marginTop:20}}>
                            <Text style={[styles.text]}>Address</Text>
                            <TextInput
                                selectionColor={themeColor}
                                multiline={true}
                                onChangeText={(address) => { this.setState({ address}) }}
                                style={{ height: height*0.17, width: "100%", backgroundColor: "#eee", borderRadius: 10, textAlignVertical: "top", padding: 5 }}
                                value={this.state.address}
                            />
                        </View>
                        {/* Mobile */}
                        <View style={{marginTop:20}}>
                            <View>
                                <Text style={styles.text}>Mobile</Text>
                            </View>
                            
                            <TextInput
                                value={this.state.mobile}
                                onChangeText={(mobile) => { this.setState({ mobile }) }}
                                keyboardType="numeric"
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee", paddingLeft: 10 ,marginTop:5}}
                            />
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={styles.text}>state</Text>
                            <TextInput
                                value={this.state.state}
                                onChangeText={(state) => { this.setState({ state }) }}
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee", paddingLeft: 10, marginTop: 5 }}
                            />
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={styles.text}>city</Text>
                            <TextInput
                                value={this.state.city}
                                onChangeText={(city) => { this.setState({ city }) }}
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee", paddingLeft: 10, marginTop: 5 }}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.text}>pincode</Text>
                            <TextInput
                                onChangeText={(pincode) => { this.setState({ pincode }) }}
                                value={this.state.pincode}
                                keyboardType="numeric"
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee", paddingLeft: 10, marginTop: 5 }}
                            />
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={styles.text}>Emergency Contact 1</Text>
                            <TextInput
                                value={this.state.firstEmergencyContactNo}
                                onChangeText={(firstEmergencyContactNo) => { this.setState({ firstEmergencyContactNo }) }}
                                keyboardType="numeric"
                                selectionColor={themeColor}
                                style={{ width:"100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee",  paddingLeft: 10 ,marginTop:5}}
                            />
                        </View>
                        <View style={{marginTop:15}}>
                            <Text style={styles.text}>Emergency Contact 2</Text>
                            <TextInput
                                value={this.state.secondEmergencyContactNo}
                                onChangeText={(secondEmergencyContactNo) => { this.setState({ secondEmergencyContactNo }) }}
                                keyboardType="numeric"
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 10, backgroundColor: "#eeee",paddingLeft: 10 ,marginTop:5}}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.text}>Latitude</Text>
                            <TextInput
                                keyboardType="numeric"
                                onChangeText={(text) => { this.setState({ latitude: text }) }}
                                value={this.state?.latitude}
                                multiline={true}
                                selectionColor={themeColor}
                                style={{ width:"100%", height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", paddingLeft: 10 ,marginTop:5}}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.text}>Longitude</Text>
                            <TextInput
                                onChangeText={(text) => { this.setState({ longitude: text }) }}
                                value={this.state?.longitude}
                                multiline={true}
                                selectionColor={themeColor}
                                style={{ width: "100%", height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee",paddingLeft: 10,marginTop:5 }}
                            />
                        </View>
                               {/* UPDATE */}
                         <View style={{marginVertical:20}}>
                             <TouchableOpacity 
                               style={{backgroundColor:themeColor,height:height*0.05,alignItems:'center',justifyContent:"center"}}
                               onPress={()=>{this.updateClinic()}}
                             >
                                 <Text style={[styles.text,{color:"#fff"}]}>update</Text>
                             </TouchableOpacity>
                         </View>  
                        {this.renderModal()}
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
        user: state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectUser })(EditClinicDetails)