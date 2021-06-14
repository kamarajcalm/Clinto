import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import wamp from 'wamp.js2';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const wampServer = settings.wampServer;
const url =settings.url
class ChatScreen extends Component {
  constructor(props) {
      
    super(props);
    this.state = {
        message:"",
        item:this.props.route.params.item,
        pk:1,
        audio:null,
        showRecordMessage:false,
        recording:false,
        Messages:[],
        chatType:"",
        loading:false,
        audioStatus:null,
        currentAudio:null,
        images:[]
    };
  }
  validatePlayButton =(item)=>{
      if (this.state?.currentAudio?.attachment == item.attachment) {
          if (this.state?.audioStatus?.isPlaying){
          return    <MaterialCommunityIcons name="pause" size={24} color="#fff" />
          }else{
              return <Entypo name="controller-play" size={24} color="#fff" />
          }
      }
      return   <Entypo name="controller-play" size={24} color="#fff" />
  
      
  }
    validateGif = (item)=>{
        if (this.state?.currentAudio?.attachment == item.attachment) {
            if (this.state?.audioStatus?.isPlaying) {
            return (
                <Image
                    style={{ height: 30, width: width * 0.4, resizeMode: "stretch" }}
                    source={require('../assets/sound.gif')}
                />

            )
            }
        }
        return (
            <Image
                style={{ height: 30, width: width * 0.4, resizeMode: "stretch" }}
                source={require('../assets/sound2.png')}
            />
        )
      
  }
  validateSeconds =(item) =>{
      if (this.state?.currentAudio?.attachment == item.attachment){
          return(
              <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{this.milliconverter(this.state?.audioStatus?.positionMillis)}/{this.milliconverter(this.state?.audioStatus?.durationMillis)}</Text>

          )
      }

  }
    milliconverter = (millis)=>{
        if (millis){
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
    messageHandler = (args) => {
        var details = args[0]
        // console.log(details, 'socket');
        if (details.thread == this.state.item.groupPk){
            if (details.attachment){
                details.attachment =`${url}${details.attachment}`
            }
       
            let list = this.state.Messages
            if(details.msgType=="image"){
                console.log("here")
            
                let pushObj = {
                    index:this.state.Messages.length,
                    url: details.attachment,
                    message:details.message
            }
               this.state.images.push(pushObj)
            }
         
            list.push(details)
         
            this.setState({Messages:list})
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
        this.setState({ selectedFile: photo, selectedType: 'image' })
    //  let sendd =new FormData();
    //  sendd.append('img',photo)
    // console.log(sendd,"hhh"),
    // client.send(sendd)
    };
    getChatMessage =async(type)=>{
        let api =`${url }/api/prescription/chats/?${type}=${this.state.item.groupPk}`
        console.log(api)
        const data = await HttpsClient.get(api)
        if(data.type =="success"){
            let arr =this.state.images
            data.data.forEach((i,index)=>{
                if(i.msgType=="image") {
                   let pushObj ={
                       index,
                       url:i.attachment,
                       message:i.message
                   }
                    arr.push(pushObj)
                }  
            })
            this.setState({Messages:data.data,images:arr})
        }
        this.setConnection()
    }
    setConnection = () => {

        this.connection = new wamp.Connection({ url: wampServer, realm: 'default' });
        // console.log(this.state.item.uid, "jhu")
        if (this.connection != null ) {
            this.connection.onopen = (session, details) => {
                session.subscribe(this.state.item.uid, this.messageHandler).then(
                    (sub) => {
                    },
                    (err) => {
                    });
            }
            this.connection.open();
            
   
        } 
       
    }
    validateChat =()=>{
        // console.log(this.props.user.profile.occupation,"ooo",this.state.item,"iii")
        //   TWO CHATS 1.doctor&patient && 2clinic&pateint
        if (this.props.user.profile.occupation=="Customer"){
         if (this.state.item.clinictitle) {
             return this.setState({ chatType: "clinic&pateint" },()=>{
                 this.getChatMessage("clinicThread")
             })
         }
         if (this.state.item.doctortitle) {
          
             return this.setState({ chatType: "doctor&pateint" },()=>{
                 this.getChatMessage('doctorThread')
             }
             
             )
         }
        } else if (this.props.user.profile.occupation == "ClinicRecoptionist" || this.props.user.profile.occupation == "MedicalRecoptionist"){
         return this.setState({ chatType: "clinic&pateint" },()=>{
             this.getChatMessage("clinicThread")
         })
        } else if (this.props.user.profile.occupation == "Doctor"){
      
            return this.setState({ chatType: "doctor&pateint" }, () => {
                this.getChatMessage("doctorThread")
            })
        } else if (this.props.user.profile.occupation == "MediacalRep") {

            return this.setState({ chatType: "clinic&pateint" }, () => {
                this.getChatMessage("clinicThread")
            })
        }
        
    }
  componentDidMount(){
    
      this.validateChat()
  

  
  }
 componentWillUnmount(){
     try{
         this.connection.close()
     }catch(e){
       console.log(e)
     }

 }
    playAudio =async(uri)=>{
        console.log(uri,"uuu")
        const source = { uri: uri }
        const initialStatus = {}
        let onPlaybackStatusUpdate =(status)=>{
            this.setState({audioStatus:status})
        }
    
        const { sound } = await Audio.Sound.createAsync(
            source,
            initialStatus,
     
            
        );
        console.log('Playing Sound');
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await sound.playAsync();
      
        console.log(onPlaybackStatusUpdate,"ppppp");
    }

    showMessage =()=>{
        this.setState({showRecordMessage:true})
        setTimeout(()=>{
            this.setState({ showRecordMessage: false})
        },1000)
    }
startRecording =async()=>{
    try {
        console.log('Requesting permissions..');
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');
        this.setState({ recording:true})
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        this.setState({ audio: recording})
        console.log('Recording started');
      recording.getStatusAsync()
            .then(function (result) {
                console.log(result.durationMillis)
            })
            .catch((err)=>{
               console.log(err,"jjjj")
            });
    } catch (err) {
        console.error('Failed to start recording', err);
    }
}
stopRecording =async()=>{
    try{
      
        console.log('Stopping recording..');
        await this.state.audio.stopAndUnloadAsync();
        const uri = this.state.audio.getURI();
        console.log('Recording stopped and stored at',uri);
        this.setState({ recording: false })
        this.setState({ audio: undefined })
        let filename = uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        var type = match ? `audio/${match[1]}` : `audio`;
        let selectedFile ={
            uri,
            type,
            name:filename
        }
        console.log(selectedFile)
        var sendData = {
         
            bodyType: 'formData',
            sender: this.props.user.id,
            msgType: 'voice',
            attachment:selectedFile,
            
        }
        if (this.state.chatType == "clinic&pateint") {
            sendData.clinicThread = this.state.item.groupPk
        }
        if (this.state.chatType == "doctor&pateint") { 
            sendData.doctorThread = this.state.item.groupPk
        }
    //    console.log(sendData,"kkk")
        this.setState({loading:true})
        var data = await HttpsClient.post(url + '/api/prescription/chats/', sendData)
        if(data.type="success"){
            this.setState({loading:false})
        }else{
            this.setState({ loading: false })
            return this.showSimpleMessage("Something Went wrong", "#dd7030")
        }
   
    }catch(err){
             console.log(err)
    }
   
    }   

    _pickImage = async () => {
        this.setState({ openImageModal: false })
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (result.cancelled == true) {
         
            return
        }
        console.log(result,"jjj")
        let filename = result.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        var type = match ? `image/${match[1]}` : `image`;
        const photo = {
            uri: result.uri,
            type: type,
            name: filename,
        };
        this.setState({ selectedFile: photo, selectedType: 'image' })
    };
sendMessage =async()=>{
    this.setState({loading:true})
    var sendData = {
        message: this.state.message,
        bodyType: 'formData',
        sender: this.props.user.id,
        msgType: 'text'
    }
    console.log(this.state.chatType,"chayyyy")
    if (this.state.chatType == "clinic&pateint"){
        console.log("jjjj")
        sendData.clinicThread= this.state.item.groupPk
    }
    if (this.state.chatType == "doctor&pateint") {
     
        sendData.doctorThread = this.state.item.groupPk
    }
    if (this.state.selectedFile != null) {
        sendData.attachment = this.state.selectedFile
        if (this.state.selectedType != null) {
            sendData.msgType = this.state.selectedType
        }
    }
    console.log(sendData,"oooo")
    let api = `${url}/api/prescription/chats/`
 
    var data = await HttpsClient.post(api,sendData)
    console.log(data,"pooo")
    // console.log(data,sendData,api)
    if(data.type =="success"){
        this.setState({ message: "", selectedFile: null, selectedType:null,loading:false})
    }else{
        this.setState({loading:false})
        return this.showSimpleMessage("Something Went wrong", "#dd7030")
    }
   
}
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
        this.setState({ openImageModal: false })
        const photo = {
            uri: picture.uri,
            type: type,
            name: filename,
        };
       
        this.setState({ selectedFile: photo, selectedType: 'image' })
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
    renderSendIcon =()=>{
        if(this.state.loading){
            return(
                <ActivityIndicator size ="large" color={themeColor}/>
            )
        }
        if (this.state.message.length > 0||this.state.sel){
            return(
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: height * 0.07, backgroundColor: themeColor, borderRadius: 30, height: height * 0.05, width: 40, margin: 10 }}
                    onPress={() => { this.sendMessage() }}
                >
                    <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity>
            )
        }
        return(
            <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: height * 0.07, backgroundColor: themeColor, borderRadius: 30, height: height * 0.05, width: 40, margin: 10 }}
                onPress={() => { this.showMessage() }}
                onPressOut={() => { this.stopRecording() }}
                onLongPress={() => { this.startRecording() }}
            >
                <FontAwesome name="microphone" size={24} color="#fff" />
            </TouchableOpacity>
        )
                {this.state.message.length > 0 ? <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: height * 0.07, backgroundColor: themeColor, borderRadius: 30, height: height * 0.05, width: 40, margin: 10 }}
                    onPress={() => { this.sendMessage() }}
                >
                    <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity> :
                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: height * 0.07, backgroundColor: themeColor, borderRadius: 30, height: height * 0.05, width: 40, margin: 10 }}
                        onPress={() => { this.showMessage() }}
                        onPressOut={() => { this.stopRecording() }}
                        onLongPress={() => { this.startRecording() }}
                    >
                        <FontAwesome name="microphone" size={24} color="#fff" />
                    </TouchableOpacity>}
            
        
    }
  render() {
      console.log(this.props.user.profile.occupation)
      const{ item }=this.state
      let chatTitle =""
      if (this.props.user.profile.occupation =="Customer"){
          chatTitle =this.state.item.clinictitle||this.state.item.doctortitle
      }
      if (this.props.user.profile.occupation == "Doctor") {
          console.log(this.state.item,"opop")
          chatTitle = this.state.item?.customertitle
      }
      if (this.props.user.profile.occupation == "ClinicRecoptionist") {
          chatTitle = this.state.item.clinictitle
      }
      if (this.props.user.profile.occupation == "MediacalRep") {
          chatTitle = this.state.item.clinictitle
      }
      if (this.props.user.profile.occupation == "MedicalRecoptionist"){
          chatTitle = this.state.item?.clinictitle
      }
//  console.log(this.props.user)
    return (
          <>
            <SafeAreaView style={styles.topSafeArea} />
            <SafeAreaView style={styles.bottomSafeArea}>
      <View style={{flex:1}}>
            {/* HEADERS */}
            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                  onPress={()=>{this.props.navigation.goBack()}}
                >
                    <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 0.8,flexDirection:"row" }}>
                  
                        <Image
                            source={{ uri: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                            style={{ height: 60, width: 60, borderRadius: 30, }}
                            
                        />
                 
                      <View style={{alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text, { color: '#fff', marginLeft: 20, fontWeight: 'bold', fontSize: 20 }]}>{chatTitle}</Text>

                      </View>
                </View>
             
            </View>
            <FlatList
              contentContainerStyle={{paddingBottom:20}} 
              onContentSizeChange={() => { this.flatRef.scrollToEnd({ animated: true }) }}
              style={{marginTop:20}}
              data={this.state.Messages}
              ref={ref => this.flatRef = ref}
              keyExtractor={(item,index)=>index.toString()}
              renderItem={({item,index})=>{
                  if (this.state.chatType =="clinic&pateint"){
                      //   if non -sender

                      if (item.senderPk.toString() != this.props.user.id.toString() && !item.is_clinic) {
                          if (item.msgType == "text") {
                              return (
                                  <View style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}>

                                      <Text style={[styles.text]}>{item.message}</Text>
                                      <View style={{ alignSelf: "flex-end" }}>
                                          <Text style={[styles.text, { color: "#1f1f1f", fontSize: 8 }]}>{moment(item.created).format('hh:mm a')}</Text>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>
                                  </View>
                              )
                          }
                          if (item.msgType == "image") {

                              return (
                                  <TouchableOpacity style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}
                                      onPress={() => {
                                          this.props.navigation.navigate('ImageViewer', { images: this.state.images, index: index })
                                      }}
                                  >
                                      <Image
                                          source={{ uri: item.attachment }}
                                          style={{ height: height * 0.15, width: width * 0.4, resizeMode: "contain" }}
                                      />

                                      <Text style={[styles.text]}>{item.message}</Text>
                                      <View style={{ alignSelf: "flex-end" }}>
                                          <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>
                                  </TouchableOpacity>
                              )

                          }
                          if (item.msgType == "voice") {
                              return (
                                  <View style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}>
                                      <View style={{ flexDirection: "row" }}>
                                          <TouchableOpacity
                                              onPress={() => {
                                                  this.setState({ currentAudio: item })
                                                  this.playAudio(item.attachment)

                                              }}

                                          >
                                              {
                                                  this.validatePlayButton(item)
                                              }


                                          </TouchableOpacity>
                                          {
                                              this.validateGif(item)
                                          }
                                          <View style={{ alignItems: "center", justifyContent: "center" }}>
                                              {
                                                  this.validateSeconds(item)

                                              }
                                          </View>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>

                                  </View>
                              )


                          }

                      }

                      //    if sender
                      if (item.msgType == "text") {
                          return (
                              <View style={{ alignSelf: 'flex-end', backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 20, marginTop: 10, maxWidth: width * 0.6 }}>
                                  <Text style={[styles.text, { color: "#fff" }]}>{item.message}</Text>
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </View>
                          )
                      }
                      if (item.msgType == "image") {

                          return (
                              <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}
                                  onPress={() => {
                                      this.props.navigation.navigate('ImageViewer', { images: this.state.images, index: index })
                                  }}
                              >
                                  <Image
                                      resizeMethod="scale"
                                      source={{ uri: item.attachment }}
                                      style={{ height: height * 0.15, width: width * 0.4, resizeMode: "contain" }}
                                  />

                                  <Text style={[styles.text, { color: "#fff" }]}>{item.message}</Text>
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </TouchableOpacity>
                          )

                      }
                      if (item.msgType == "voice") {

                          return (
                              <View style={{ alignSelf: "flex-end", backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}>
                                  <View style={{ flexDirection: "row" }}>
                                      <TouchableOpacity
                                          onPress={() => {
                                              this.setState({ currentAudio: item })
                                              this.playAudio(item.attachment)

                                          }}

                                      >
                                          {
                                              this.validatePlayButton(item)
                                          }


                                      </TouchableOpacity>
                                      {
                                          this.validateGif(item)
                                      }
                                      <View style={{ alignItems: "center", justifyContent: "center" }}>
                                          {
                                              this.validateSeconds(item)

                                          }
                                      </View>
                                  </View>
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </View>
                          )


                      }
                  }else{
                      //   if non -sender

                      if (item.senderPk.toString() != this.props.user.id.toString()) {
                          if (item.msgType == "text") {
                              return (
                                  <View style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}>

                                      <Text style={[styles.text]}>{item.message}</Text>
                                      <View style={{ alignSelf: "flex-end" }}>
                                          <Text style={[styles.text, { color: "#1f1f1f", fontSize: 8 }]}>{moment(item.created).format('hh:mm a')}</Text>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>
                                  </View>
                              )
                          }
                          if (item.msgType == "image") {

                              return (
                                  <TouchableOpacity style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}
                                      onPress={() => {
                                          this.props.navigation.navigate('ImageViewer', { images: this.state.images, index: index })
                                      }}
                                  >
                                      <Image
                                          source={{ uri: item.attachment }}
                                          style={{ height: height * 0.15, width: width * 0.4, resizeMode: "contain" }}
                                      />

                                      <Text style={[styles.text]}>{item.message}</Text>
                                      <View style={{ alignSelf: "flex-end" }}>
                                          <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>
                                  </TouchableOpacity>
                              )

                          }
                          if (item.msgType == "voice") {
                              return (
                                  <View style={{ alignSelf: "flex-start", backgroundColor: '#eeee', padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}>
                                      <View style={{ flexDirection: "row" }}>
                                          <TouchableOpacity
                                              onPress={() => {
                                                  this.setState({ currentAudio: item })
                                                  this.playAudio(item.attachment)

                                              }}

                                          >
                                              {
                                                  this.validatePlayButton(item)
                                              }


                                          </TouchableOpacity>
                                          {
                                              this.validateGif(item)
                                          }
                                          <View style={{ alignItems: "center", justifyContent: "center" }}>
                                              {
                                                  this.validateSeconds(item)

                                              }
                                          </View>
                                      </View>
                                      <View style={styles.leftArrow}></View>

                                      <View style={styles.leftArrowOverlap}></View>

                                  </View>
                              )


                          }

                      }

                      //    if sender
                      if (item.msgType == "text") {
                          return (
                              <View style={{ alignSelf: 'flex-end', backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 20, marginTop: 10, maxWidth: width * 0.6 }}>
                                  <Text style={[styles.text, { color: "#fff" }]}>{item.message}</Text>
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </View>
                          )
                      }
                      if (item.msgType == "image") {

                          return (
                              <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.6 }}
                               onPress ={()=>{
                                   this.props.navigation.navigate('ImageViewer',{images:this.state.images,index:index})
                               }}
                              >
                                  <Image
                                      resizeMethod="scale"
                                      source={{ uri: item.attachment }}
                                      style={{ height: height * 0.2, width: width * 0.5, resizeMode:"cover" }}
                                  />

                                  <Text style={[styles.text, { color: "#fff" }]}>{item.message}</Text>
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </TouchableOpacity>
                          )

                      }
                      if (item.msgType == "voice") {

                          return (
                              <View style={{ alignSelf: "flex-end", backgroundColor: themeColor, padding: 10, borderRadius: 20, marginRight: 10, marginTop: 10, marginLeft: 20, maxWidth: width * 0.7 }}>
                                  <View style={{flexDirection:"row"}}>
                                      <TouchableOpacity
                                          onPress={() => {
                                              this.setState({currentAudio:item})
                                              this.playAudio(item.attachment) 
                                            
                                            }}

                                      >
                                      {
                                        this.validatePlayButton(item)
                                      }

                                          
                                      </TouchableOpacity>
                                    {
                                        this.validateGif(item)
                                    }
                                      <View style={{alignItems:"center",justifyContent:"center"}}>
                                          {
                                              this.validateSeconds(item)

                                          }
                                      </View>
                                  </View>
                 
                                  <View style={{ alignSelf: "flex-end" }}>
                                      <Text style={[styles.text, { color: "#fff", fontSize: 8 }]}>{moment(item?.created).format("hh:mm a")}</Text>
                                  </View>
                                  <View style={styles.rightArrow}></View>

                                  <View style={styles.rightArrowOverlap}></View>
                              </View>
                          )


                      }
                  }
               

           
            
              }}
            />
            <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center",minHeight:height*0.07,elevation:5,backgroundColor:"#eee"}}> 
                <View style={{ backgroundColor: "#fafafa",minHeight: height * 0.05, maxHeight: height * 0.2, borderRadius: 15,flex:1,marginLeft:20,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{ flex:0.8 ,alignItems:"center",justifyContent:"center"}}>
                        {!this.state.recording?
                            <TextInput
                                value={this.state.message}
                                multiline={true}
                                style={{ width: "100%", minHeight: height * 0.05, maxHeight: height * 0.2, paddingLeft: 5 ,alignSelf:"center"}}
                                selectionColor={themeColor}
                                placeholder="Write a message...."
                                onChangeText={(text) => {
                                    this.setState({message:text})
                                   
                                }}
                            />:
                            <View style={{justifyContent:'center',height:height*0.05,}}>
                                <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={[styles.text,{color:themeColor,marginLeft:20}]}>Recording.....</Animatable.Text>
                            </View>
                        }
                      
                    </View>
                    <TouchableOpacity style={{ flex: 0.2,alignItems:'center',justifyContent:"center"}}
                      onPress={()=>{this.setState({openImageModal:true})}}
                    >
                        <Entypo name="attachment" size={24} color={themeColor} />
                    </TouchableOpacity>
                </View>

                <View style={{height:height*0.05,alignItems:'center',justifyContent:"center",}}>
                    {
                        this.renderSendIcon()
                    }
                </View>
                {this.state.showRecordMessage&&<View 
                
                style={{position:"absolute",bottom:60,backgroundColor:themeColor,width:width*0.5,height:height*0.05,alignItems:"center",justifyContent:"center",borderRadius:10,right:25}}>
                    <Text style={[styles.text,{color:"#fff",fontSize:12}]}>Hold to record,release to send</Text>
                    <View style={styles.rightArrow}></View>

                    <View style={styles.rightArrowOverlap}></View>
                </View>}
                
               
            </View>
          {this.state.selectedType=="image"&&<View style={{position:"absolute",height:height*0.07,bottom:60,backgroundColor:"#fafafa",left:20,width:width*0.2,borderRadius:10}}>
                    <TouchableOpacity style={{alignSelf:"flex-end",marginTop:-15,marginRight:-10}}
                      onPress={()=>{this.setState({selectedFile:null,selectedType:null})}}
                    >
                            <Entypo name="circle-with-cross" size={24} color="red" />
                    </TouchableOpacity>   
                        
               <Image 
                 source={{uri:this.state.selectedFile.uri}}
                 style={{height:50,width:50}}
               />
            </View>}
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
    rightArrow: {
        position: "absolute",
        backgroundColor: themeColor,
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
    },

    rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#fff",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20

    },
    leftArrow: {
        position: "absolute",
        backgroundColor: "#eeee",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomRightRadius: 25,
        left: -10
    },

    leftArrowOverlap: {
        position: "absolute",
        backgroundColor: "#fff",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomRightRadius: 18,
        left: -20

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
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ChatScreen);