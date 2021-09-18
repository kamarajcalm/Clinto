import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    SafeAreaView,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    TextInput,
    BackHandler,
    RefreshControl,
    Keyboard,
    Platform,
    Linking

} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import settings from '../AppSettings';
import { Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectTheme,selectClinic } from '../actions';
import authAxios from '../api/authAxios';
import HttpsClient from "../api/HttpsClient";
import Modal from 'react-native-modal';
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,MaterialIcons} from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const url =settings.url
const fontFamily = settings.fontFamily;
const themeColor =settings.themeColor
import * as Location from 'expo-location';
const { height,width } = Dimensions.get("window");
const { diffClamp } = Animated;

import { Swipeable } from "react-native-gesture-handler";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants'; 
import Reports from "../components/Reports";
import Shimmer from "../components/Shimmer";
import ShimmerLoader from "../components/ShimmerLoader";
const {statusBarHeight} =Constants
class Priscription extends React.Component {
    constructor(props) {
        const Date1 = new Date()
        const day = Date1.getDate()
        const month = Date1.getMonth() + 1
        const year = Date1.getFullYear()
        const today = `${year}-${month}-${day}`
        const showDate = `${day}-${month}-${year}`
        super(props);
        this.state = {
            showList: true,
            today,
            showDate,
            mode: 'date',
            date: new Date(),
            show: false,
            user:this.props.user,
            isDoctor:false,
            loading:true,
            showModal:false,
            selectedClinic:null,
            clinics:[],
            prescriptions:[],
            isReceptionist:false,
            isFetching:false,
            search:false,
            textRef1:React.createRef(),
            textRef2:React.createRef(),
            cancelToken: undefined,
            offset:0,
            next:true,
            keyBoard:false,
            ReportsState:false,
            reports:[],
            offset2:0,
            totalcount:0,
            count2:0,
            showShimmer:true
        };
        this.scrollY=new Animated.Value(0)
        this.translateYNumber= React.createRef()
        this.swipeRef=[]
    } 
    handleEndReached =()=>{
        if(this.state.next){
            this.setState({offset:this.state.offset+6},()=>{
               if(this.state.isDoctor){
                   this.getPrescription()
               }else if(this.state.isReceptionist){
                   this.getClinicPrescription()
               }else{
                   this.getPateintPrescription()
               }
             
            })
        }
    }
        handleEndReached2 =()=>{
        if(this.state.next2){
            this.setState({offset2:this.state.offset2+10},()=>{
              this.getPatientReports();
            })
        }
    }
showDatePicker = () => {
       this.setState({show:true})
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
 handleConfirm = (date) => {
     this.setState({})
     this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, prescriptions: [], offset: 0, next: true, showDate: moment(date).format('DD-MM-YYYY')  }, () => {
         if(this.state.isDoctor){
             this.getPrescription()
         }else if(this.state.isReceptionist){
             this.getClinicPrescription()
         }else{
             return null
         }

     })
        this.hideDatePicker();
    };

    getPateintPrescription = async()=>{
        let api = `${url}/api/prescription/prescriptions/?forUser=${this.props.user.id}&limit=6&offset=${this.state.offset}`
        let data =await HttpsClient.get(api)
        console.log(api)
        if(data.type =="success"){
            this.setState({ prescriptions: this.state.prescriptions.concat(data.data.results),isFetching:false,totalcount:data.data.count,showShimmer:false})
            if(data.data.next!=null){
                this.setState({next:true})
            }else{
                this.setState({ next:false})
            }
        }
    }
    getPrescription = async()=>{
      
        let api = `${url}/api/prescription/prescriptions/?doctor=${this.props.user.id}&date=${this.state.today}&limit=6&offset=${this.state.offset}`
        console.log(api)
        let data  =await HttpsClient.get(api)
    
      if(data.type == 'success'){
          this.setState({ prescriptions:this.state.prescriptions.concat(data.data.results),totalcount:data.data.count,showShimmer:false})
          this.setState({ loading: false ,isFetching:false})
          if (data.data.next != null) {
              this.setState({ next: true })
          } else {
              this.setState({ next: false })
          }
      }
    }
    getClinicPrescription = async()=>{
        let api = `${url}/api/prescription/prescriptions/?clinic=${this.props.user.profile.recopinistclinics[0].clinicpk}&date=${this.state.today}&limit=6&offset=${this.state.offset}`
        let data = await HttpsClient.get(api)
  console.log(api)
        if (data.type == 'success') {
            this.setState({ prescriptions: this.state.prescriptions.concat(data.data.results),totalcount:data.data.count,showShimmer:false})
            this.setState({ loading: false ,isFetching:false})
            if (data.data.next != null) {
                this.setState({ next: true })
            } else {
                this.setState({ next: false })
            }
        }
     
    }
    getClinics = async()=>{
        const api = `${url}/api/prescription/getDoctorClinics/?doctor=${this.props.user.id}`
        const data = await HttpsClient.get(api)
        console.log(api,"ggghdf")
       console.log(data)
        if(data.type=="success"){
            this.setState({ clinics: data.data.workingclinics})
            let activeClinic = data.data.workingclinics.filter((i)=>{
                return i.active
            })
         console.log(activeClinic[0])
            this.props.selectClinic(activeClinic[0]||data.data.workingclinics[0])
      
        }
    }
    setActiveClinic = async(item) => {
        const api = `${url}/api/prescription/doctorActive/`
        let sendData ={
            deactiveClinic:this.props.clinic.pk,
            activeClinic:item.pk
        }
        let patch = await HttpsClient.post(api,sendData)
        if(patch.type =="success"){
        
            this.props.selectClinic(item)
            this.setState({showModal:false})
        }
    
    }
    getPatientReports = async()=>{
          let api =`${url}/api/prescription/getreports/?user=${this.props.user.id}&limit=10&offset=${this.state.offset2}`
          let data =  await HttpsClient.get(api)
          console.log(api)
          if(data.type=="success"){
              this.setState({reports:this.state.reports.concat(data.data.results),count2:data.data.count})
                this.setState({ loading: false ,isFetching:false})
              if(data.data.next){
                  this.setState({next2:true})
              }else{
                   this.setState({next2:false})
              }
          }
    }
    findUser =()=>{
        if (this.props.user.profile.occupation =="Doctor"){
           
              this.getClinics()
              this.getPrescription()
              this.setState({isDoctor:true,})
        } else if (this.props.user.profile.occupation == "ClinicRecoptionist"){
            this.getClinicPrescription()
            this.setState({ isReceptionist: true, })
        }
        else{
     

            this.getPateintPrescription()
            this.getPatientReports()
        }

        this.setState({ loading: false })
    }
    getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return;
        }
        Location.getCurrentPositionAsync()
    }
    componentDidMount(){
       console.log(this.props.user)
       this.findUser()
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if(this.props.user.profile.occupation=="Doctor"){
              return  this.setState({prescriptions:[],offset:0,next:true,showShimmer:true},()=>{
                    this.getPrescription()
                })
             
            }
            if(this.props.user.profile.occupation=="ClinicRecoptionist"){
                return  this.setState({prescriptions:[],offset:0,next:true,showShimmer:true},()=>{
                    this.getClinicPrescription()
                })   
            }
               return  this.setState({prescriptions:[],offset:0,next:true,showShimmer:true},()=>{
                    this.getPateintPrescription()
                }) 
            
        });
        Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
         this._unsubscribe();
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
    _keyboardDidShow = () => {
        this.setState({ keyBoard:true })
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoard:false })
    };
    searchPriscriptions = async (text) => {
     
        if (typeof this.state.cancelToken != typeof undefined) {
            this.state.cancelToken.cancel('cancelling the previous request')
        }
        this.state.cancelToken = axios.CancelToken.source()
        let api = `${url}/api/prescription/prescriptions/?forUser=${this.props.user.id}&usersearch=${text}`
        const data = await axios.get(api, { cancelToken: this.state.cancelToken.token });
        this.setState({next:false})
        this.setState({prescriptions:data.data})
    }
    searchPriscriptions2 = (text) => {
        let filter = this.state.prescriptions.filter((i) => {
            let match = i.username.toUpperCase()
            console.log(match,"gjhgjh")
            return match.includes(text.toUpperCase())
        })
        console.log(filter)
        this.setState({ prescriptions: filter })
    }

    getIndex = (index) => {
        let value = this.state.totalcount- index
        return value
    }
    makeInvalid = async(item,index)=>{
        this.swipeRef[index].close();
        let api = `${url}/api/prescription/prescriptions/${item.id}/`
        console.log(api)
        if(!item.active){
            return this.showSimpleMessage("Prescription Already Invalid ! please Make Another One","orange","info")
        }
        let sendData = {
            active:false
        }
        let post = await HttpsClient.patch(api, sendData)
        if (post.type == "success") {
           
            let duplicate =  this.state.prescriptions
            duplicate[index].active = false
           return this.showSimpleMessage("changed successfully", "#00A300", "success")
         
        } else {
          
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    rightSwipe =(progress,dragX,item,index)=>{
        const { height,width } = Dimensions.get("window");
      
        const scale = dragX.interpolate({
            inputRange:[0,100],
            outputRange:[0,1],
            extrapolate:"clamp"
        })
        return(
            <TouchableOpacity style={{  backgroundColor:item.active?"red":"green", height: height * 0.15, alignItems:"center",justifyContent:"center"}}
              onPress={() => { this.makeInvalid(item, index)}}
            >
              
                   <View 
                   
                    style={{width:width*0.3,alignItems:"center",justifyContent:"center",}}
                   >
                    <Text style={[styles.text, { color: "#fff",  }]}>{item.active ?"Make Invalid":"Make valid"}</Text>
                   </View>
             
            </TouchableOpacity>
        )
    }
    closeRow =(index)=>{
       this.swipeRef.forEach((i)=>{
           if (i != this.swipeRef[index]){
              i.close();
           }
       
       })

    }
    getFirstLetter =(item ,clinic=null)=>{
        let name = item.username.name.split("")
        let clinicName = item.clinicname.name.split("")
        if(clinic){
            return clinicName[0].toUpperCase();
        }
        return name[0].toUpperCase()
    }
    chatClinic = async (item) => {


        let api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }else{
            this.showSimpleMessage("try again ","orange","info")
        }
    }
    chatClinicAndCustomer = async(item)=>{
               let api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${item.forUser}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }else{
            this.showSimpleMessage("try again ","orange","info")
        }  
    }
    chatWithDoctor = async(user)=>{
          let    api = `${url}/api/prescription/createDoctorChat/?doctor=${this.props.user.id}&customer=${user}`
          let data = await HttpsClient.get(api)
                if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }else{
            this.showSimpleMessage("try again ","orange","info")
        }
    }
    separator = () =>{
      return(
          <View>
              <Text style={[styles.text]}> , </Text>
          </View>
      )
    }
    footer =()=>{
        return(
            <View>
                    <Text style={[styles.text]}> . </Text>
            </View>
        )
    }
    showDifferentPriscription = (item, index) => {
       
        const { height,width } = Dimensions.get("window");
        if (this.state.isDoctor){
          return(
            <Swipeable
                onSwipeableRightOpen={() => { this.closeRow(index)}}
            
                ref={ref=>this.swipeRef[index]=ref}
                renderRightActions={(progress, dragX) => this.rightSwipe(progress, dragX, item, index)}
            >
                <TouchableOpacity style={[styles.card, { flexDirection: "row",    height: height * 0.15,}]}
                    // onPress={() => { props.navigation.navigate('showCard', { item }) }}
                    onPress={() => { this.props.navigation.navigate('PrescriptionViewDoctor',{item})}}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <LinearGradient 
                              style={{ height: 50, width: 50, borderRadius: 25,alignItems: "center", justifyContent: "center" }}
                              colors={["#333", themeColor, themeColor]}
                        >
                              <View >
                                  <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item)}</Text>
                              </View>
                        </LinearGradient>
                       
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                 <View style={{flexDirection:"row"}}>
                                      <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>{item?.username?.name}</Text>
                                      <Text style={[styles.text, {}]}> ({item?.age} - {item?.sex})</Text>
                                 </View>
                                  
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
                     <View style={{ marginTop: 10,flexDirection:"row" }}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text]}>Diagnosis : </Text>
                            </View>
                            <View style={{flexDirection:"row",width:"100%",flexWrap:"wrap"}}>
                                {
                                    item?.diseaseTitle?.map((it,index)=>{
                                      
                                                 return(
                                        <View key={index}>
                                            <Text style={[styles.text]}>{it}</Text>    
                                        </View>
                                    )
                                    })
                                }
                
                            </View>
                     
                        </View>
                         <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                   <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => { this.chatWithDoctor(item.forUser) }}
                                    >
                                        <Ionicons name="chatbox" size={24} color="#63BCD2" />

                                    </TouchableOpacity>
                                               <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                       
                                      if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.username.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.username.mobile}`)
                                    }}}
    
    
                        >
                           <Ionicons name="call" size={24} color="#63BCD2" />
                        </TouchableOpacity>
                           <View>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                            </View>
                         </View>
                    </View>

                </TouchableOpacity>
            </Swipeable>
            )
        }
        if (this.state.isReceptionist) {
            let dp = null
            if (item?.doctordetails?.dp) {
                dp = `${url}${item?.doctordetails?.dp}`
            }

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5,    height: height * 0.2, }]}
                    onPress={() => { this.props.navigation.navigate('PrescriptionViewDoctor', { item }) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: themeColor, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 18 }]}>{this.getFirstLetter(item)}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username.name}</Text>

                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10,flexDirection:"row" }}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text]}>Diagnosis : </Text>
                            </View>
                            <FlatList 
                               horizontal={true}
                               ItemSeparatorComponent={this.separator}
                               data={item.diseaseTitle}
                               keyExtractor={(item,index)=>index.toString()}
                               renderItem={({item,index})=>{
                                    return(
                                        <View>
                                            <Text style={[styles.text]}>{item}</Text>    
                                        </View>
                                    )
                               }}
                            />
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View>
                                <Text style={[styles.text]}>{item.doctordetails.name}</Text>
                            </View>
                           
                        </View>
                                <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                   <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => { this.chatClinicAndCustomer(item) }}
                                    >
                                        <Ionicons name="chatbox" size={24} color="#63BCD2" />

                                    </TouchableOpacity>
                                               <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                       
                                      if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.username.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.username.mobile}`)
                                    }}}
    
    
                        >
                           <Ionicons name="call" size={24} color="#63BCD2" />
                        </TouchableOpacity>
                           <View>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                            </View>
                         </View>
                    </View>
                </TouchableOpacity>
            )
        }

        // if patient
        return (
            <TouchableOpacity style={[styles.card2, { flexDirection: "row", borderRadius: 10 ,}]}
                onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
            >
                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: themeColor, alignItems: "center", justifyContent: "center" }}>
                        <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 18 }]}>{this.getFirstLetter(item,"clinic")}</Text>
                    </View>
                </View>
                <View style={{ flex: 0.7,justifyContent: 'center',}}>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          
                         <Text style={[styles.text,{color:"#000",fontSize:18}]} numberOfLines={1}>{item.clinicname.name}</Text>
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text,{marginRight:10}]}>#{this.getIndex(index)}</Text>
                        </View>
                    </View>
                      <View style={{ marginTop: 10,flexDirection:"row" }}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={[styles.text]}>Diagnosis : </Text>
                            </View>
                            <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",justifyContent:"space-around",flex:1}}>
                                        {
                                item?.diseaseTitle?.map((itemm,index)=>{
                                            return(
                                        <View>
                                            <Text style={[styles.text]}>{itemm}  {index< item?.diseaseTitle.length-1&&","}</Text> 
                                           
                                        </View>
                                    ) 
                                })
                            }
                            </View>
                    
                            {/* <FlatList
                               ListFooterComponent={this.footer} 
                               horizontal={true}
                               ItemSeparatorComponent={this.separator}
                               data={item.diseaseTitle}
                               keyExtractor={(item,index)=>index.toString()}
                               renderItem={({item,index})=>{
                                
                               }}
                            /> */}
                        </View>
                  
                    <View style={{ flexDirection: "row", marginVertical:10 }}>
                        <View style={{flex:0.5,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => { this.chatClinic(item) }}
                        >
                            <Ionicons name="chatbox" size={24} color="#63BCD2" />

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                                Linking.openURL(
                                    `https://www.google.com/maps/dir/?api=1&destination=` +
                                    item.clinicname.lat +
                                    `,` +
                                    item.clinicname.long +
                                    `&travelmode=driving`
                                );
                            }}
                        >
                            <FontAwesome5 name="directions" size={20} color="#63BCD2" />
                        </TouchableOpacity>
                        </View>
                
                         <View style={{alignItems:"center",justifyContent:"center",flex:0.5}}>
                            <View style={{}}>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm A")}</Text>

                            </View>
                            <View style={{}}>
                                <Text style={[styles.text]}>{moment(item.created).format('DD/MM/YYYY')}</Text>
                            </View>
                         </View>
                         
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
    onRefresh =()=>{
        this.setState({isFetching:true})
        if(this.state.isDoctor){
            this.setState({ prescriptions: [], offset: 0, next: true }, () => {
                this.getPrescription()
            })
         
        }else if(this.state.isReceptionist){
            this.setState({ prescriptions: [], offset: 0, next: true }, () => {
                this.getClinicPrescription()
            })
          
        }else{
            this.setState({prescriptions:[],offset:0,next:true},()=>{
                this.getPateintPrescription()
            })
         
        }
    }
        onRefresh2 =()=>{
        this.setState({isFetching:true})

            this.setState({reports:[],offset2:0,next2:true},()=>{
                this.getPatientReports()
            })
         
        
    }
    renderFilter = () => {
        const { height,width } = Dimensions.get("window");
        const headerHeight = height*0.2   
        if (this.state.isDoctor || this.state.isReceptionist) {
            return (

                <View style={{ alignItems: "center", justifyContent: "center", width: width * 0.32, }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff" }]}>{this.state.showDate}</Text>
                        </View>

                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => {this.setState({show:true}) }}
                        >
                            <Fontisto name="date" size={24} color={"#fff"} />
                        </TouchableOpacity>


                        <DateTimePickerModal
                            isVisible={this.state.show}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                        />
                    </View>

                </View>

            )
        } else {
            return null
        }
    }

  validateHeaders = () => {
    const { height,width } = Dimensions.get("window");
    const headerHeight = height*0.2
        return (
            <LinearGradient 
               colors={["#333", themeColor, themeColor]}
            >
                <View style={{ height: headerHeight / 2,flexDirection:"row",}}>
                 { this.props.user.profile.occupation=="Customer"  ? <TouchableOpacity style={{flex:0.6,justifyContent:"center",flexDirection:"row",}}
                       onPress={()=>{
                           this.setState({ReportsState:!this.state.ReportsState})
                       }}
                     >
                         <View style={{height:'100%',flexDirection:"row",width:width*0.5,}}>
                                           <View style={{justifyContent:"center",}}>
                             <View style={{}}>

                              <Text style={{ color: '#fff', fontFamily: "openSans" ,fontSize: height*0.04, fontWeight: "bold" }}>{!this.state.ReportsState?"Prescription":"Reports"}</Text>

                             </View>

                         </View>
                         <View style={{justifyContent:"center",marginTop:5}}>
                             <MaterialIcons name="arrow-drop-down" size={30} color="#fff" />
                         </View>
                         </View>
                  
                     </TouchableOpacity>:
                     <View style={{flex:0.6,justifyContent:"center",flexDirection:"row",}}>
                                         <View style={{justifyContent:"center",}}>
                             <View style={{}}>

                              <Text style={{ color: '#fff', fontFamily: "openSans" ,fontSize: height*0.04, fontWeight: "bold" }}>{!this.state.ReportsState?"Prescription":"Reports"}</Text>

                             </View>

                         </View>
                     </View>
                     }
                    <View style={{flex:0.4,alignItems: "center", justifyContent: 'center'}}>
                        {
                            this.renderFilter()
                        }
                    </View>
                </View>

                <View style={{ marginHorizontal: 20, height: headerHeight/2, alignItems: 'center', justifyContent: "center", }}>
                    <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height:height*0.065,alignItems:"center",justifyContent:"center"}}>
                        <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                            <EvilIcons name="search" size={24} color="black" />
                        </View>
                        <TextInput
                            selectionColor={themeColor}
                            style={{ height: "99%", flex: 0.8, backgroundColor: "#eee", paddingLeft: 10,justifyContent:"center" }}
                            placeholder={`search  ${this.state.ReportsState?"report":this.props?.clinic?.name ||"prescription"}`}
                            onChangeText={(text) => { this.searchPriscriptions(text) }}
                        />
                    </View>

                </View>
            </LinearGradient>
        )
    }
    renderFooter =()=>{
       if(this.state.next&&!this.state.isFetching){
           return(
               <ActivityIndicator size="large" color ={themeColor} />
           )
       }
       return null
    }
  
    renderFooter2 =()=>{
       if(this.state.next2&&!this.state.isFetching){
           return(
               <ActivityIndicator size="large" color ={themeColor} />
           )
       }
       return null
    }
    
    getCloser = (value, checkOne, checkTwo) =>
        Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

     validateView =(height,width,headerHeight,handleScroll)=>{
         if(this.state.showShimmer){
             return (
                <ScrollView contentContainerStyle={{paddingTop:headerHeight}}>
                          <ShimmerLoader />
                          <ShimmerLoader />
                          <ShimmerLoader />
                </ScrollView>
             )   
         }
       
         if(this.state.ReportsState){
             return (
                        <Animated.FlatList
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.onRefresh2()}
                                    refreshing={this.state.isFetching}
                                    progressViewOffset={headerHeight}
                                />
                            }
                            data={this.state.reports}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: headerHeight+height*0.01, paddingBottom: 90 }}
                            onScroll={handleScroll}
                            ref={ref=>this.ref=ref}
                             
                            onEndReached ={()=>{this.handleEndReached2()}}
                            ListFooterComponent={this.renderFooter2()}
                            onEndReachedThreshold={0.1}
                            renderItem={({item,index})=>{
                               return(
                                  
                                   <Reports item={item} index={index} count={this.state.count2} navigation={this.props.navigation}/>
                                
                                 
                                  
                               )
                          }}
                        />
             )
         }
         return(
 <Animated.FlatList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={() => this.onRefresh()}
                                    refreshing={this.state.isFetching}
                                    progressViewOffset={headerHeight}
                                />
                            }
                            data={this.state.prescriptions}
                            scrollEventThrottle={16}
                            contentContainerStyle={{ paddingTop: headerHeight+height*0.01, paddingBottom: 150}}
                            onScroll={handleScroll}
                            ref={ref=>this.ref=ref}
                            bounces={false}
                            onEndReached ={()=>{this.handleEndReached()}}
                            ListFooterComponent={this.renderFooter()}
                            onEndReachedThreshold={0.1}
                            renderItem={({item,index})=>{
                               return(
                                  
                                       <View>
                                           {
                                               this.showDifferentPriscription(item, index)
                                           }

                                       </View>
                                
                                 
                                  
                               )
                          }}
                        />
                          
            
         )
     }   
    render() { 
        const { height,width } = Dimensions.get("window");
        const headerHeight = height * 0.2;
const screenHeight =Dimensions.get('screen').height;
        const scrollYClamped = diffClamp(this.scrollY, 0, headerHeight);

        const translateY = scrollYClamped.interpolate({
            inputRange: [0, headerHeight],
            outputRange: Platform.OS=="android"?[0, -(headerHeight / 2)-10]:[0, -(headerHeight / 2+statusBarHeight-30)],
        });


        translateY.addListener(({ value }) => {
           this.translateYNumber.current = value;
        });

        const handleScroll = Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: { y: this.scrollY },
                    },
                },
            ],
            {
                useNativeDriver: true,
            },
        );

        const handleSnap = ({ nativeEvent }) => {
            
            const offsetY = nativeEvent.contentOffset.y;
            if (
                !(
                    this.translateYNumber.current === 0 ||
                    this.translateYNumber.current === -headerHeight / 2
                )
            ) {
                if (this.ref) {
               
                    this.ref.scrollToOffset({
                        offset:
                            this.getCloser(this.translateYNumber.current, -headerHeight / 2, 0) ===
                                -headerHeight / 2
                                ? offsetY + headerHeight / 2
                                : offsetY - headerHeight / 2,
                    });
                }
            }
        };
        return (
           
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                <StatusBar backgroundColor={"#333"} barStyle={"default"}/>
                    {/* HEADERS */}
                    <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                        {
                          this.validateHeaders()
                        }

                    </Animated.View>
   <Animated.View style={{flex:1,backgroundColor:"#f3f3f3f3"}}>
           {
               this.validateView(height,width,headerHeight,handleScroll)
           }
              
                       

                  { this.props.user.profile.occupation!="Customer"&&!this.state.keyBoard&&<View style={{
                            position: "absolute",
                            bottom: 100,
                            left: 20,
                            right: 20,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 20
                        }}>
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate('addPriscription',) }}
                            >
                                <AntDesign name="pluscircle" size={40} color={themeColor} />
                            </TouchableOpacity>
                        </View>}
            </Animated.View>
                    <Modal
                        deviceHeight={screenHeight}
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        isVisible={this.state.showModal}
                        onBackdropPress={() => { this.setState({showModal : false })}}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            
                            <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <View style={{ alignItems: "center", justifyContent: "center",marginTop:10 }}>
                                    <Text style={[styles.text, { color: "#000", fontWeight: "bold" ,fontSize:16}]}>Select Clinic</Text>
                                </View>
                                <FlatList
                                    data={this.state.clinics}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width }}
                                                onPress={() => { this.setActiveClinic(item) }}
                                            >
                                                <Text style={[styles.text]}>{item.name}</Text>
                                                <View >
                                                    <FontAwesome name="dot-circle-o" size={24} color={this.props.clinic == item ? themeColor : "gray"} />

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                            </View>
                        </View>
                    </Modal>
         </SafeAreaView>
        
        </>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor: themeColor,
        elevation: 6
    },
    subHeader: {
     
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily,
         fontSize:height*0.02
    },
    root: {
        flex: 1, 
        marginHorizontal: 20
    },
    container: {
        flex: 1
    },
    card: {
        backgroundColor: "#fff",
    
        borderColor:"gray",
        borderBottomWidth:0.5
       

    },
    card2:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: "#fff",
     
        marginHorizontal: 10,
        marginVertical: 3
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: themeColor
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
});
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user:state.selectedUser,
        clinic:state.selectedClinic

    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(Priscription)