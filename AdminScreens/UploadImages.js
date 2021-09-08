import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage, ScrollView, Alert} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
import { ActivityIndicator } from 'react-native-paper';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get('screen').height
const url =settings.url
class UploadImages extends Component {
    constructor(props) {
      
        super(props);
        this.state = {
           images:[],
           uploadedimages:[],
           uploadModal:false
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

    removeImage = async(item, index) => {
        
        let duplicate = this.state.uploadedimages
        let api = `${url}/api/prescription/clinicImages/${item.id}/`
        let del = await HttpsClient.delete(api)
        if(del.type == "success"){
            duplicate.splice(index, 1)
            this.setState({ uploadedimages: duplicate })
            return this.showSimpleMessage("deleted successFully","green","success")
        }else{
            return this.showSimpleMessage("Try Again", "red", "danger")
        }
      
    }
    removeItem =(item,index)=>{
         
        let duplicate = this.state.images
        duplicate.splice(index, 1)
        this.setState({ images: duplicate })
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
        this.setState({ images: duplicate })
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
        console.log(picture)
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
    uploadModal =()=>{
        return(
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.uploadModal}
            >
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <View style={{backgroundColor:"#fff",borderRadius:40,padding:10}}>
                        <ActivityIndicator color={themeColor} size={"large"} />
                </View>
            
            </View>
            </Modal>
        )
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
    UploadImages = (item)=>{ 
        let sendData = {
            displayPicture: item,
            clinic: this.props.route.params.clinic,
            bodyType: "formData"
        }
        console.log(sendData)
        let api = `${url}/api/prescription/clinicImages/`
       
        return new Promise( async(resolve,reject)=>{
           let post =  await HttpsClient.post(api,sendData)
           if(post.type =="success"){
               resolve(post)
           }else{
               reject("errr")
               return this.showSimpleMessage("Try Again", "red", "failure")
        
           }
        })
  
    }


    getImages = async () => {
       
        let api = `${url}/api/prescription/clinicImages/?clinic=${this.props.route.params.clinic}`

        let data = await HttpsClient.get(api)
      
        if (data.type == "success") {
            let uploadedimages = []
            data.data.forEach((item, index) => {
                let pushObj ={
                    uri: `${url}${item.imageUrl}`,
                    id:item.id
                }
                uploadedimages.push(pushObj)
            })
            this.setState({ uploadedimages })

        }

    }
    upload = () => {
        if (this.state.images.length == 0) {
            return this.showSimpleMessage("please add Images ", "orange", "info")
        }
        var promises = [];
        this.setState({ uploadModal: true }, () => {
            this.state.images.forEach((item, index) => {
                promises.push(this.UploadImages(item));
            })
        })
        Promise.all(promises).then(async () => {
            this.setState({ uploadModal: false, images: [] })
         
          this.showSimpleMessage("uploaded successfully", "green", "success")
            
        }).catch(() => {
            return this.showSimpleMessage("Try Again", "red", "failure")
        })
       setTimeout(()=>{
           this.getImages();
        },1000)

    }
    createAlert = (item, index) => {
        Alert.alert(
            "Do you want to delete?",
            ``,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.removeImage(item, index) } }
            ]
        );
    }
    componentDidMount(){
        this.getImages()
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
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Upload Images</Text>
                            </View>
                            <View style={{ flex:0.2}}>
                                
                            </View>
                           

                  
                        </View>
                        <ScrollView>
                            <View style={{marginVertical:10,marginLeft:10}}>
                                <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>Uploaded Images :</Text>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", marginVertical: 20 }}>
                                {
                                    this.state.uploadedimages.map((item, index) => {
                                        return (
                                            <View style={{ marginTop: 20 }}>
                                                <Image
                                                    source={{ uri: item.uri}}
                                                    style={{ height: 100, width: 100, }}
                                                />
                                                <View style={{ position: "absolute", bottom: 0, right: 3 }}>
                                                    <TouchableOpacity
                                                        onPress={() => { this.createAlert(item,index)}}
                                                    >
                                                        <MaterialIcons name="delete" size={24} color="red" />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>

                                        )
                                    })
                                }
                            </View>
                            <View style={{ marginVertical: 10, marginLeft: 10 }}>
                                <Text style={[styles.text, { color: "#000", textDecorationLine: "underline" }]}>Newly added Images :</Text>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", marginVertical: 20 }}>
                                {
                                    this.state.images.map((item,index) => {
                                        return (
                                            <View style={{ marginTop: 20 }}>
                                                <Image
                                                    source={{ uri: item.uri }}
                                                    style={{ height: 100, width: 100, }}
                                                />
                                                <View style={{ position: "absolute", bottom: 0, right: 3 }}>
                                                    <TouchableOpacity
                                                        onPress={() => { this.removeItem(item,index)}}
                                                    >
                                                        <MaterialIcons name="delete" size={24} color="red" />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>

                                        )
                                    })
                                }
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                    onPress={() => { this.setState({ openImageModal: true, }) }}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>Add Image</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ alignItems: 'center', justifyContent: 'center' ,marginTop:30}}>
                                <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}
                                    onPress={() => { this.upload()}}
                                >
                                    <Text style={[styles.text, { color: "#fff" }]}>upload Images</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
          
                    {this.renderModal()}
                    {
                        this.uploadModal()
                    }
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
export default connect(mapStateToProps, { selectTheme })(UploadImages);
