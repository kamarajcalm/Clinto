import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage, ScrollView,TextInput } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign, Entypo, FontAwesome, Fontisto} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import * as  ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import HttpsClient from '../api/HttpsClient';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url =settings.url
class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"kamaraj",
            mobileNO:"9585858585",
            email:"kamraj089@gmail.com",
            age:"23",
            height:"",
            bloodGroup:"B +ve",
            healthIssue:"",
            healthIssues:[],
            dob:"",
            show:false,
            Password:'kamaraj@98',
            Password2:"kamaraj@98",
            lastname:"Mariyappan"
        };
    }
     CreateAccount = async()=>{
         if(this.state.Password!=this.state.Password2){
            return this.showSimpleMessage("Password not matched", "#dd7030")
         }
       let api = `${url}/api/profile/userRegister/`
       let sendData ={
           first_name:this.state.name,
           last_name:this.state.lastname,
           dob:this.state.dob,
           mobile:this.state.mobileNO,
           email:this.state.email,
           blood_group:this.state.bloodGroup,
           password:this.state.Password,
           bodyType:'formData'
       }
       let post  =await HttpsClient.post(api,sendData)
      if(post.type =="success"){
          this.showSimpleMessage("Account Created SuccessFully", "#00A300", "success")
          return this.props.navigation.goBack()
      }else{
          this.showSimpleMessage(`${post?.data?.failed}`, "#B22222", "danger")
      }
    }
    componentDidMount() {

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
    deleteIssues = (i, index) => {
        let duplicate = this.state.healthIssues
        duplicate.splice(index, 1)
        this.setState({ healthIssues: duplicate })
    }
    pushIssues = (issue) => {
        if (this.state.healthIssue != "") {
            let duplicate = this.state.healthIssues
            duplicate.push(this.state.healthIssue)
            return this.setState({ healthIssues: duplicate, healthIssue: "" })
        } else {
            return this.showSimpleMessage("Health issue should not be empty", "#dd7030")
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
    showDatePicker = () => {
        this.setState({ show: true })
    };

    hideDatePicker = () => {
        this.setState({ show: false })
    };

    handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        this.setState({ dob: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {
           

        })
        this.hideDatePicker();
    };
  
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
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                                      {/* HEADERS */}
                            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>
                                    <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                        onPress={() => { this.props.navigation.goBack() }}
                                    >
                                        <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { color: '#fff', marginLeft: 20, fontWeight: "bold", fontSize: 20 }]}>Create Account</Text>
                                    </View>
                                    <View style={{ flex: 0.2 }}>
                                    </View>
                            </View>

                        <View style={{ flex: 1 }}>
                          


                            <ScrollView 
                                contentContainerStyle={{margin:20}}
                                keyboardShouldPersistTaps={"handled"}
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
                                    <Text style={styles.text}>First Name</Text>
                                    <TextInput
                                        value={this.state.name}
                                        onChangeText={(name) => { this.setState({ name }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Last Name</Text>
                                    <TextInput
                                        value={this.state.lastname}
                                        onChangeText={(lastname) => { this.setState({ lastname }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Date of Birth</Text>
                                    <View style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10,flexDirection:"row" }}>
                                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
                                         onPress ={()=>{this.setState({show:true})}}
                                        >
                                            <Fontisto name="date" size={24} color="black" />
                                        </TouchableOpacity>
                                        <View style={{marginLeft:10,alignItems:"center",justifyContent:'center'}}>
                                            <Text>{this.state.dob}</Text>
                                        </View>

                                    </View>
                                 
                                </View>
                                <View >
                                    <Text style={styles.text}>Mobile No</Text>
                                    <TextInput
                                       keyboardType ="numeric"
                                        value={this.state.mobileNO}
                                        onChangeText={(mobileNO) => { this.setState({ mobileNO }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Email</Text>
                                    <TextInput
                                        value={this.state.email}
                                        onChangeText={(email) => { this.setState({ email }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                {/* <View >
                                    <Text style={styles.text}>Age</Text>
                                    <TextInput
                              
                                    keyboardType="numeric"
                                        value={this.state.age}
                                        onChangeText={(age) => { this.setState({ age }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View> */}
                                {/* <View >
                                    <Text style={styles.text}>Height</Text>
                                    <TextInput
                                        value={this.state.height}
                                        onChangeText={(age) => { this.setState({ age }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View> */}
                                <View >
                                    <Text style={styles.text}>Blood Group</Text>
                                    <TextInput
                                        value={this.state.bloodGroup}
                                        onChangeText={(bloodGroup) => { this.setState({ bloodGroup }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Password</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        value={this.state.Password}
                                        onChangeText={(Password) => { this.setState({ Password }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Confirm Password</Text>
                                    <TextInput
                                        secureTextEntry={true}
                                        value={this.state.Password2}
                                        onChangeText={(Password2) => { this.setState({ Password2 }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                {/* <View style={{ marginTop: 20 }}>
                                    <Text style={[styles.text], { fontWeight: "bold", fontSize: 18 }}>Health issues</Text>
                                    {
                                        this.state?.healthIssues?.map((i, index) => {
                                            return (
                                                <View style={{ margin: 10, flexDirection: "row" }}
                                                    key={index}
                                                >
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text>{index + 1}. {i}</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ flex: 0.3 }}
                                                        onPress={() => { this.deleteIssues(i, index) }}

                                                    >
                                                        <Entypo name="circle-with-cross" size={24} color="red" />
                                                    </TouchableOpacity>

                                                </View>
                                            )
                                        })
                                    }
                                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around" }}>
                                        <TextInput
                                            value={this.state.healthIssue}
                                            selectionColor={themeColor}
                                            multiline={true}
                                            onChangeText={(healthIssue) => { this.setState({ healthIssue }) }}
                                            style={{ width: width * 0.6, height: height * 0.07, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10, }}
                                        />
                                        <TouchableOpacity
                                            style={{ height: height * 0.05, alignItems: "center", justifyContent: 'center', width: width * 0.2, borderRadius: 10, backgroundColor: themeColor, marginTop: 10 }}
                                            onPress={() => { this.pushIssues() }}

                                        >
                                            <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View> */}
                                <View style={{ alignItems: 'center', justifyContent: 'center' ,marginVertical:40}}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                      onPress ={()=>{this.CreateAccount()}}
                                    >
                                        <Text style={[styles.text, { color: "#fff" }]}>Create</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePickerModal
                                    isVisible={this.state.show}
                                    mode="date"
                                    onConfirm={this.handleConfirm}
                                    onCancel={this.hideDatePicker}
                                />
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
        user: state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme })(CreateAccount);

