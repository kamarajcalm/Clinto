import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, RefreshControl,ActivityIndicator} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url =settings.url;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import GetLocation from 'react-native-get-location';

class CreateDiagnosticCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            openImageModal: false,
            latitude: "",
            longitude: '',
            clinicName: "",
            openingTime: null,
            closingTime: null,
            show1: false,
            show2: false,
            mobile:"",
            GST:"",
            address:"",
            pincode:"",
            state:"",
            city:"",
            firstEmergencyContactNo: "",
            secondEmergencyContactNo: '',
            startingArray:[],
            closingArray: [],
            day: "",
            isFetching:false,
            doctor:null,
            images:[],
            email:"",
            creating:false
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

    createClinic = async()=>{
        this.setState({creating:true})
       let token = await AsyncStorage.getItem('csrf')
      
       
         if(this.state.doctor == null){
             this.setState({ creating: false })
             return this.showSimpleMessage("Please select owner", "#dd7030",)
         
         }
        if (this.state.clinicName == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill clinicName", "#dd7030",)
    
        }
        if (this.state.mobile == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill mobile", "#dd7030",)
        }
        if (this.state.email == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill email", "#dd7030",)
        }
        if (this.state.GST == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill GST", "#dd7030",)
           
        }
        if (this.state.pincode == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill pincode", "#dd7030",)
        }
        if (this.state.address == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill address", "#dd7030",)
        }
        if (this.state.city == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill city", "#dd7030",)
    
        }
        if(this.state.state ==""){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill state", "#dd7030",)
            
        }
        if (this.state.latitude == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill latitude", "#dd7030",)
        }
        if (this.state.longitude == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please fill longitude", "#dd7030",)
        }
       
        
        let api =  `${url}/api/prescription/createClinic/`

   
        let sendData ={
            owner: this.state.doctor.user.id,
            mobile:this.state.mobile,
            gstin:this.state.GST,
            companyName:this.state.clinicName,
            address:this.state.address,
            pincode:this.state.pincode,
            state:this.state.state,
            city:this.state.city,
            lat:this.state.latitude,
            long:this.state.longitude,
            offical_email:this.state.email,
            type:"Lab",
        }
        console.log(sendData)
        if (this.state.image){
            sendData.bodyType = "formData"
        }
     
        const post = await HttpsClient.post(api,sendData)
        console.log(post,"pppp")
       if(post.type=="success"){
            this.setState({creating:false})
           this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
        return  this.props.navigation.navigate('UpdateTimings', { clinicPk: post.data.clinicPk})
       }else{
           this.setState({ creating: false })
           this.showSimpleMessage("Try again", "#B22222", "danger")
       }

    }
    backFunction = async (item) => {
        console.log(item,"bbbbbb")
       this.setState({ doctor:item})
       

    }
    removeImage =(item,index)=>{
        console.log("hhfff")
        let duplicate = this.state.images
        duplicate.splice(index,1)
        this.setState({ images:duplicate})
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
        let duplicate = this.state.images
        duplicate.push(photo)
        this.setState({images:duplicate})
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
        let duplicate = this.state.images
        duplicate.push(photo)
        this.setState({ images: duplicate })
        this.setState({ image: photo, changedImage: true })
    }
     getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return;
        }
         Location.installWebGeolocationPolyfill();
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(async(location) => {
            this.setState({
                    isFetching: false,
                    latitude: location.latitude,
                    longitude: location.longitude,
                })
        })
      
    }
    onRefresh =()=>{
        this.setState({isFetching:true})
        this.getLocation()
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
        this.getLocation()
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
                                <Text style={[styles.text, { color: "#fff" }]}>Create Diagostic Center</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ margin: 20 }}
                                refreshControl ={
                                    <RefreshControl
                                        refreshing={this.state.isFetching}
                                        onRefresh={()=>{this.onRefresh()}}
                                    />
                                }
                                showsVerticalScrollIndicator={false}
                            >
                                {/* <View style={{ height: height * 0.12, alignItems: "center", justifyContent: 'center' }}>
                                    <Image
                                        source={{ uri:this.state?.image?.uri||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                        style={{ height: 60, width: 60, borderRadius: 30 }}
                                    />

                                    <TouchableOpacity style={{ position: "absolute", right: 140 }}

                                        onPress={() => { this.setState({ openImageModal: true, }) }}
                                    >
                                        <Entypo name="edit" size={20} color={themeColor} />
                                    </TouchableOpacity>
                                </View> */}
                                
                                <View >
                                    <Text style={styles.text}>Owner Name</Text>
                                    <TouchableOpacity 
                                        style={{ width: width * 0.8, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 ,justifyContent:"center"}}
                                        onPress={() => { this.props.navigation.navigate('SearchLabOwner', { backFunction: (item) => { this.backFunction(item) } })}}
                                    >
                                        <Text>{this.state?.doctor?.name}</Text>
                                    </TouchableOpacity>
                                    {/* <TextInput
                                        value={this.state.Name}
                                        onChangeText={(Name) => { this.setState({ Name }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    /> */}
                                </View>
                                <View >
                                    <Text style={styles.text}>Diagnostic Center Name</Text>
                                    <TextInput
                                   
                                        value={this.state.clinicName}
                                        onChangeText={(clinicName) => { this.setState({ clinicName }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>

                                

                                
                               
                                <View>
                                    <Text style={styles.text}>Mobile</Text>
                                    <TextInput
                                        value={this.state.mobile}
                                        onChangeText={(mobile) => { this.setState({ mobile }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Email</Text>
                                    <TextInput
                                        value={this.state.email}
                                        onChangeText={(email) => { this.setState({ email }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>GST IN</Text>
                                    <TextInput
                                        value={this.state.GST}
                                        onChangeText={(GST) => { this.setState({ GST }) }}
                                  
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>address</Text>
                                    <TextInput
                                        onChangeText={(address) => { this.setState({ address }) }}
                                        value={this.state.address}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.15, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 ,textAlignVertical:"top"}}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>pincode</Text>
                                    <TextInput
                                        onChangeText={(pincode) => { this.setState({ pincode }) }}
                                        value={this.state.pincode}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>state</Text>
                                    <TextInput
                                        value={this.state.state}
                                        onChangeText={(state) => { this.setState({ state }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>city</Text>
                                    <TextInput
                                        value={this.state.city}
                                        onChangeText={(city) => { this.setState({ city }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                {/* <View>
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
                                </View> */}
                             
                                <View>
                                    <Text style={styles.text}>Latitude</Text>
                                    <TextInput
                                       keyboardType ="numeric"
                                        onChangeText={(text) => { this.setState({ latitude:text})}}
                                        value={this.state?.latitude.toString()}
                                        multiline={true}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Longitude</Text>
                                    <TextInput
                                        onChangeText={(text) => { this.setState({ longitude: text }) }}
                                        value={this.state?.longitude.toString()}
                                        multiline={true}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                 {/* <View>
                                     <View>
                                           <Text>Images :</Text>
                                     </View>
                                     <View style={{ flexDirection: "row",flexWrap:"wrap",alignItems: "center",justifyContent:"space-around",marginVertical:20}}>
                                        {
                                            this.state.images.map((item, index) => {
                                                return (
                                                    <View style={{marginTop:20}}>
                                                        <Image
                                                            source={{ uri: item.uri }}
                                                            style={{ height: 100, width: 100, }}
                                                        />
                                                        <View style={{position:"absolute",top:0,right:3}}>
                                                            <TouchableOpacity 
                                                                onPress={() => { this.removeImage(item,index)}}
                                                            >
                                                                <Entypo name="circle-with-cross" size={24} color="red" />
                                                            </TouchableOpacity>
                                                           
                                                        </View>
                                                    </View>

                                                )
                                            })
                                        }
                                     </View>
                                 
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                            onPress={()=> {this.setState({ openImageModal: true, })}}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add Image</Text>
                                        </TouchableOpacity>
                                    </View>
                                 </View> */}
                                <View style={{ alignItems: 'center', justifyContent: 'center' ,marginTop:30}}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                      
                                      onPress={()=>{this.createClinic()}}
                                    >
                                      { this.state.creating?<ActivityIndicator size={"large"} color={"#fff"}/> :<Text style={[styles.text, { color: "#fff" }]}>Create</Text>}
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
export default connect(mapStateToProps, { selectTheme })(CreateDiagnosticCenter)