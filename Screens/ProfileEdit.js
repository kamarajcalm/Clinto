import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView,  TextInput ,ActivityIndicator} from 'react-native';
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
import { ScrollView,} from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
const url = settings.url;
const screenHeight =Dimensions.get("screen").height
class ProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false,
            showModal: false,
            openImageModal:false,
            name: this.props.user.profile.name,
            phoneNo: this.props.user.profile.mobile,
            dob: this.props.user.profile.dob,
            imageuri: this.props.user.profile.displayPicture,
            address: this.props.user.profile.address,
            city: this.props.user.profile.city,
            state: this.props.user.profile.state,
            pincode: this.props.user.profile.pincode,
            bloodGroup: this.props.user.profile.blood_group,
            image:null,
            updating:false,
            email: this.props.user.email,
            healthIssues: this.props.user.profile.health_issues,
            Qualification:"",
            Qualifications: this.props.user.profile.qualifications||[]
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
    getSelfMode = async()=>{
        const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`);
        if(data.type =="success"){
            this.props.selectUser(data.data[0]);
            this.showSimpleMessage("Profile Updated Successfully", "green", "success")
         return   this.setState({ updating: false })
        }
  
    
    }
    updateQualification = async() =>{
        let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
        let sendData = {
            qualifications:this.state.Qualifications

        }
        let patch = await HttpsClient.patch(api, sendData)

       return patch
    }
     updateProfile2 = async() =>{
         let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
         let sendData = {
             name: this.state.name,
             mobile: this.state.phoneNo,
             dob: this.state.dob,
             blood_group: this.state.bloodGroup,
             address: this.state.address,
             city: this.state.city,
             state: this.state.state,
             pincode: this.state.pincode,
             email: this.state.email

         }
         if (this.state.image) {
             sendData.displayPicture = this.state.image,
             sendData.bodyType = "formData"
         }
         let patch = await HttpsClient.patch(api, sendData)
         return patch
     }
    updateDoctorProfile = async()=>{
        this.setState({ updating: true })
        if (this.state.name == "") {
            this.showSimpleMessage("please fill name", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.phoneNo == "") {
            this.showSimpleMessage("please fill phoneNo", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.dob == null) {
            this.showSimpleMessage("please fill dob", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.bloodGroup == "") {
            this.showSimpleMessage("please fill bloodGroup", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.address == "") {
            this.showSimpleMessage("please fill address", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.city == "") {
            this.showSimpleMessage("please fill city", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.state == "") {
            this.showSimpleMessage("please fill state", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.pincode == "") {
            this.showSimpleMessage("please fill pincode", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.Qualifications.length == 0) {
            this.showSimpleMessage("please fill qualification", "orange", "info")
            return this.setState({ updating: false })
        }
        const promise1 =  await this.updateProfile2()
        const promise2 =  await this.updateQualification()
        if(promise1.type =="success" && promise2.type =="success"){
            this.getSelfMode()

        }else{
            this.showSimpleMessage("Try Again", "red", "danger")
            this.setState({ updating: false })
        }
    
    }
    updateProfile = async()=>{
        this.setState({updating:true})
        if(this.state.name ==""){
            this.showSimpleMessage("please fill name","orange","info")
            return this.setState({ updating: false })
        }
        if (this.state.phoneNo == "") {
            this.showSimpleMessage("please fill phoneNo", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.dob == null) {
            this.showSimpleMessage("please fill dob", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.bloodGroup == "") {
            this.showSimpleMessage("please fill bloodGroup", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.address == "") {
            this.showSimpleMessage("please fill address", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.city == "") {
            this.showSimpleMessage("please fill city", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.state == "") {
            this.showSimpleMessage("please fill state", "orange", "info")
            return this.setState({ updating: false })
        }
        if (this.state.pincode == "") {
            this.showSimpleMessage("please fill pincode", "orange", "info")
            return this.setState({ updating: false })
        }
        let api = `${url}/api/profile/userss/${this.props.user.profile.id}/`
        let sendData ={
            name:this.state.name,
            mobile:this.state.phoneNo,
            dob:this.state.dob,
            blood_group:this.state.bloodGroup,
            address:this.state.address,
            city:this.state.city,
            state:this.state.state,
            pincode:this.state.pincode,
            email:this.state.email
           
        }
        if(this.state.image){
            sendData.displayPicture = this.state.image,
            sendData.bodyType = "formData"
        }
        let patch = await HttpsClient.patch(api,sendData)
    
        console.log(sendData,patch)
        if(patch.type =="success"){
            this.getSelfMode()
       

        }else{
            this.showSimpleMessage("Try Again", "red", "danger")
            this.setState({ updating: false })
        }
    }
    handleConfirm = (date) => {
     
        this.setState({ dob: moment(date).format('YYYY-MM-DD'), show: false, }, () => {
      

        })
        this.hideDatePicker();
    };
    hideDatePicker = () => {
        this.setState({ show: false })
    };
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
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        });
        console.log(result)
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
        this.setState({ image: photo, selectedType: 'image', imageuri: photo.uri })
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
        this.setState({ image: photo, changedImage: true, imageuri:photo.uri})
    }
    renderModal = () => {
        return (
            <Modal
                statusBarTranslucent ={true}
                deviceHeight ={screenHeight}
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
                            <Text style={{ fontSize: 16, color: themeColor, textAlign: 'center', marginLeft: width * 0.1 }}>Gallery</Text>
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
    removeQualification = (item, index) => {
        let duplicate = this.state.Qualifications
        duplicate.splice(index, 1)
        this.setState({ duplicate: this.state.Qualifications })
    }
    addQualification = () => {
        if (this.state.Qualification == "") {
            return this.showSimpleMessage("Please fill Qualification", "#dd7030",)
        }
        this.state.Qualifications.push(this.state.Qualification)
        this.setState({ Qualifications: this.state.Qualifications, Qualification: "" })
    }
    componentDidMount() {
      console.log(this.props.user)
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, }}>
                        <StatusBar backgroundColor={themeColor}/>
                                    {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Edit Profile</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>
                                
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ margin: 20 }}
                                keyboardShouldPersistTaps ={"handled"}
                                showsVerticalScrollIndicator={false}
                            >
                            <View style={{ height: height * 0.12, alignItems: "center", justifyContent: 'center' }}>
                                <Image
                                        source={{ uri: this.state.imageuri ||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                    style={{ height: 60, width: 60, borderRadius: 30 }}
                                />
                                
                                <TouchableOpacity style={{ position: "absolute", right:width*0.3 }}
            
                                    onPress={() => { this.setState({ openImageModal: true,}) }}
                                >
                                    <Entypo name="edit" size={20} color={themeColor} />
                                </TouchableOpacity>
                            </View>
                           
                            
                          
                                <View >
                                    <Text style={styles.text}>Name</Text>
                                    <TextInput 
                                      value={this.state.name}
                                      selectionColor={themeColor}
                                      onChangeText={(name) => { this.setState({name})}}
                                      style={{width:width*0.7,height:35,borderRadius:15,backgroundColor:"#eeee",margin:10,paddingLeft:10}}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Phone No</Text>
                                    <TextInput
                                        value={this.state.phoneNo}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        onChangeText={(phoneNo) => { this.setState({phoneNo})}}
                                        style={{ width: width * 0.7, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Email </Text>
                                    <TextInput
                                        value={this.state.email}
                                    
                                        selectionColor={themeColor}
                                        onChangeText={(email) => { this.setState({ email }) }}
                                        style={{ width: width * 0.7, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                {this.props.user.profile.occupation == "Doctor" &&         <View>
                                    <Text style={styles.text}>Qualification</Text>
                                    {
                                        this.state.Qualifications.map((item, index) => {
                                            return (
                                                <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "center" }} key={index}>
                                                    <View>
                                                        <Text style={[styles.text, { color: "#000" }]}>{item}</Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        style={{ marginLeft: 10 }}
                                                        onPress={() => { this.removeQualification(item, index) }}
                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                        <TextInput
                                            autoCapitalize={"characters"}
                                            onChangeText={(Qualification) => { this.setState({ Qualification }) }}
                                            value={this.state.Qualification}
                                            selectionColor={themeColor}
                                            style={{ width: width * 0.6, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                        />
                                        <TouchableOpacity style={{ height: height * 0.05, width: width * 0.2, backgroundColor: themeColor, alignItems: "center", justifyContent: "center", borderRadius: 5 }}
                                            onPress={() => { this.addQualification() }}
                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>}
                                {this.props.user.profile.occupation =="Customer"&& <View style={{marginVertical:10}}>
                                    <View>
                                        <Text style={[styles.text,{textDecorationLine:"underline",color:"#000"}]}>Update HealthIssues :</Text>
                                    </View>
                                    <View>
                                        {
                                            this.state.healthIssues.map((item,index)=>{
                                                    return(
                                                        <View style={{flexDirection:"row",marginLeft:width*0.2,marginTop:5}}>
                                                            <View>
                                                                <Text style={[styles.text]}> {index + 1} . </Text>
                                                            </View>
                                                           <View>
                                                                <Text style={[styles.text]}>{item}</Text>
                                                           </View>
                                                     
                                                        </View>
                                                    )
                                            })
                                        }
                                        <View style={{alignItems:"center",marginVertical:20}}> 
                                            <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:10}}
                                             onPress ={()=>{this.props.navigation.navigate('EditHealthIssues',{item:this.state.healthIssues})}}
                                            >
                                                <Text style={[styles.text,{color:"#fff"}]}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>}
                                <View>
                                    <Text style={styles.text}>Date of Birth</Text>
                                     <TouchableOpacity
                                        onPress={()=>{this.setState({show:true})}}
                                        style={{ width: width * 0.7, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", flexDirection: "row", margin: 10, paddingLeft: 10 ,alignItems:"center",justifyContent:"space-between"}}
                                     >
                                          <View>
                                            <Text style={[styles.text]}>{this.state.dob}</Text>
                                          </View>
                                          <View>
                                            <MaterialIcons name="date-range" size={24} color="black" />
                                          </View>
                                     </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.text}>Blood Group</Text>
                                    <TextInput
                                        value={this.state.bloodGroup}
                                        onChangeText={(bloodGroup) => { this.setState({bloodGroup})}}
                                  
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.7, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Address</Text>
                                    <TextInput
                                        value={this.state.address}
                                     
                                        selectionColor={themeColor}
                                        onChangeText={(address) => { this.setState({ address})}}
                                        style={{ width: width * 0.7, height: height * 0.1, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 ,textAlignVertical:"top"}}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>city</Text>
                                    <TextInput
                                        value={this.state.city}
                                   
                                        selectionColor={themeColor}
                                        onChangeText={(city) => { this.setState({ city})}}
                                        style={{ width: width * 0.7, height:35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>State</Text>
                                    <TextInput
                                        value={this.state.state}
                                       
                                        selectionColor={themeColor}
                                        onChangeText={(state) => { this.setState({ state})}}
                                        style={{ width: width * 0.7, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Pincode</Text>
                                    <TextInput
                                        value={this.state.pincode}
                                        keyboardType={"numeric"}
                                        selectionColor={themeColor}
                                        onChangeText={(pincode) => { this.setState({ pincode }) }}
                                        style={{ width: width * 0.7, height: 35, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                             
                                <View style={{alignItems:'center',justifyContent:'center',marginVertical:20}}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center" ,backgroundColor:themeColor}}
                                     onPress ={()=>{
                                         if (this.props.user.profile.occupation == "Doctor"){
                                             this.updateDoctorProfile()
                                         }else{
                                             this.updateProfile()
                                         }
                                 
                                    
                                    }}
                                    >
                                       {this.state.updating?<ActivityIndicator size={"large"} color={"#fff"}/>: <Text style={[styles.text,{color:"#fff"}]}>Update</Text>}
                                    </TouchableOpacity>
                                </View>
                                
                            </ScrollView>

                        </View>
                     
                        {this.renderModal()}
                    </View>

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
export default connect(mapStateToProps, { selectTheme, selectUser })(ProfileEdit)