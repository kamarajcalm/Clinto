import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import authAxios from '../api/authAxios';
const url= settings.url
class CreateDoctors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            openImageModal: false,
            Qualification:"mbbs",
            Name: "kamaraj",
            Mobile: "7010117133",
            Age: "22",
            Specialization: "heart surgeon",
            Experience: "10",
            NoOfClinics: "2",
            Location: "bengaluru",
            Pan:"w54647866",
            Address:'4/120 vellacheri',
            Pincode:"634085",
            State:"Karnataka",
            City:"Bengaluru",
            firstEmergencyContactNo:"9869669867",
            secondEmergencyContactNo:'9778776767',
            image:null
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
    createDoctor = async()=>{
      let api = `${url}/api/profile/createUser/`

      if(this.state.Name ==""){
          return this.showSimpleMessage("Please fill Name", "#dd7030",)
      }

        if (this.state.Mobile == "") {
            return this.showSimpleMessage("Please fill Mobile", "#dd7030",)
        }
        if (this.state.Pan == "") {
            return this.showSimpleMessage("Please fill Pan", "#dd7030",)
        }
        if (this.state.Age == "") {
            return this.showSimpleMessage("Please fill Age", "#dd7030",)
          
        }
        if (this.state.Qualification == "") {
            return this.showSimpleMessage("Please fill Qualification", "#dd7030",)
        }
        if (this.state.Specialization == "") {
            return this.showSimpleMessage("Please fill Specialization", "#dd7030",)

        }
        if (this.state.Experience == "") {
            return this.showSimpleMessage("Please fill Experience", "#dd7030",)
        }
        if (this.state.Pan == "") {
            return this.showSimpleMessage("Please fill Pan", "#dd7030",)
        }
        if (this.state.Address == "") {
            return this.showSimpleMessage("Please fill Address", "#dd7030",)
        }
        if (this.state.Pincode == "") {
            return this.showSimpleMessage("Please fill Pincode", "#dd7030",)
        }
        if (this.state.State == "") {
            return this.showSimpleMessage("Please fill State", "#dd7030",)
           
        }
        if (this.state.City == "") {
            return this.showSimpleMessage("Please fill City", "#dd7030",)
        }
        if (this.state.NoOfClinics == "") {
            return this.showSimpleMessage("Please fill NoOfClinics", "#dd7030",)
        }
      let sendData ={
          name:this.state.Name,
          displayPicture:this.state.image,
          mobile:this.state.Mobile,
          pan:this.state.Pan,
          address:this.state.Address,
          pincode:this.state.Pincode,
          state:this.state.State,
          city:this.state.City,
          firstEmergencyContactNo:this.state.firstEmergencyContactNo,
          secondEmergencyContactNo:this.state.secondEmergencyContactNo,
          specialization:this.state.Specialization,
          qualification:this.state.Qualification,
          clinicsHandling:this.state.NoOfClinics,
          occupation:"Doctor"
      }
      if(this.state.image){
          sendData.bodyType= "formData"
      }
      
      let post = await HttpsClient.post(api,sendData)
      console.log(post,"hhh")
        if (post.type =="success"){
            this.showSimpleMessage("created SuccessFully", "#00A300", "success")
      
          setTimeout(()=>{
              this.props.navigation.goBack();
          },2000)
         
      }else{

            this.showSimpleMessage("Try again", "#B22222", "danger")
      }
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
    componentDidMount() {
       
    }
    render() {
        
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Create Doctor</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                     

                            <ScrollView style={{ margin: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ height: height * 0.12, alignItems: "center", justifyContent: 'center' }}>
                                    <Image
                                        source={{ uri:this.state?.image?.uri ||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                        style={{ height: 60, width: 60, borderRadius: 30 }}
                                    />

                                    <TouchableOpacity style={{ position: "absolute", right: 140 }}

                                        onPress={() => { this.setState({ openImageModal: true, }) }}
                                    >
                                        <Entypo name="edit" size={20} color={themeColor} />
                                    </TouchableOpacity>
                                </View>
                                <View >
                                    <Text style={styles.text}>Name</Text>
                                    <TextInput
                                        value={this.state.Name}
                                        onChangeText={(Name) => { this.setState({ Name }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Mobile</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        value={this.state.Mobile}
                                        onChangeText={(Mobile) => { this.setState({ Mobile }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                           
                                
                                <View>
                                    <Text style={styles.text}>Age</Text>
                                    <TextInput
                                        value={this.state.Age}
                                        onChangeText={(Age) => { this.setState({ Age }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                 <View>
                                    <Text style={styles.text}>Qualification</Text>
                                    <TextInput
                                    autoCapitalize={"characters"}
                                        onChangeText={(Qualification) => { this.setState({ Qualification }) }}
                                        value={this.state.Qualification}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Specialization</Text>
                                    <TextInput
                                        onChangeText={(Specialization) => { this.setState({ Specialization }) }}
                                        value={this.state.Specialization}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Experience</Text>
                                    <TextInput
                                        onChangeText={(Experience) => { this.setState({ Experience }) }}
                                        value={this.state.Experience}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Pan</Text>
                                    <TextInput
                                        value={this.state.Pan}
                                        onChangeText={(Pan) => { this.setState({ Pan }) }}
                                        autoCapitalize="characters"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Address</Text>
                                    <TextInput
                                        value={this.state.Address}
                                        onChangeText={(Address) => { this.setState({ Address }) }}
                                        multiline={true}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.15, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Pincode</Text>
                                    <TextInput
                                        value={this.state.Pincode}
                                        onChangeText={(Pincode) => { this.setState({ Pincode }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>State</Text>
                                    <TextInput
                                        value={this.state.State}
                                        onChangeText={(State) => { this.setState({ State }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>City</Text>
                                    <TextInput
                                        value={this.state.City}
                                        onChangeText={(City) => { this.setState({ City }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Emergency Contact 1</Text>
                                    <TextInput
                                        value={this.state.firstEmergencyContactNo}
                                        onChangeText={(firstEmergencyContactNo) => { this.setState({ firstEmergencyContactNo }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Emergency Contact 2</Text>
                                    <TextInput
                                        value={this.state.secondEmergencyContactNo}
                                        onChangeText={(secondEmergencyContactNo) => { this.setState({ secondEmergencyContactNo }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                              
                           
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                      onPress={()=>{this.createDoctor()}}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Create</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>

                        </View>

                        {this.renderModal()}
                    
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
    }
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(CreateDoctors)