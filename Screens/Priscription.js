import React, { useRef ,useEffect,useState} from 'react';
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
    Linking
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import settings from '../AppSettings';
import { Fontisto } from '@expo/vector-icons';
import moment from 'moment';
import { connect } from 'react-redux';
import { selectTheme, selectClinic ,selectWorkingClinics,selectOwnedClinics} from '../actions';
import axios from 'axios';
import HttpsClient from "../api/HttpsClient";
import Modal from 'react-native-modal';
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Priscription1 from './Priscription1';
import { color } from 'react-native-reanimated';
const url = settings.url
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor

const { height, width } = Dimensions.get("window");
const screenHeight = Dimensions.get('screen').height;


const { diffClamp } = Animated;
const headerHeight = height*0.2;
const Date1 = new Date()
const today1 = moment(Date1).format("YYYY-MM-DD")
const getCloser = (value, checkOne, checkTwo) =>
Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;
const Priscription = (props) => {
    let cancelToken;
          //   STATES
    const[collapsed,setCollapsed] =useState(false)
    const[check,setChecked] =useState(false)
    const [showList,setShowList] =useState(true)
    const [today, setToday] = useState(today1)
    const stateRef = useRef("")
    const clinicRef =useRef("")
    const [mode, setMode] = useState("date")
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [user, setUser] = useState(props.user)
    const [isDoctor, setIsDoctor] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showModal,setShowModal] =useState(false)
    const [selectedClinic, setSelectedClinic] = useState(null)
    const [clinics,setClinics] =useState([])
    const [prescriptions, setPrescriptions] =useState([])
    const [isReceptionist,setIsReceptionist] =useState(false)
    const [isFetching, setIsFetching] =useState(false)
    const [search,setSearch] =useState(false)
    const [button,setButton] =useState(true)
    const [expiryModal, setExpiryModal] =useState(false)

    

    //         search:false,


    const ref = useRef(null);

    const scrollY = useRef(new Animated.Value(0));
    const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

    const translateY = scrollYClamped.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight / 2)],
    });

    const translateYNumber = useRef();

    translateY.addListener(({ value }) => {
    
        translateYNumber.current = value;
    });
const getIndex =(index) =>{
    let value =prescriptions.length-index
    return value
}
    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: { y: scrollY.current },
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
                translateYNumber.current === 0 ||
                translateYNumber.current === -headerHeight / 2
            )
        ) {
            if (ref.current) {
               
                ref.current.scrollToOffset({
                    offset:
                        getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
                            -headerHeight / 2
                            ? offsetY + headerHeight / 2
                            : offsetY - headerHeight / 2,
                });
            }
        }
    };
                        //   USE EFFECT



    useEffect(() => {
        if (props.user.profile.occupation == "Doctor") {
            clinicRef.current = props.clinic
            getPrescription()
            if (props.clinic?.validtill?.available == false) {
                setExpiryModal(true)
            } else {
                setExpiryModal(false)
            }
        }

    }, [props.clinic])

    useEffect(() => {
        if (isDoctor) {
            getPrescription()
        } else {
            getClinicPrescription()
        }
    }, [date])
        //   ComponentDidmount
    useEffect(() => {
        setLoading(true)
        stateRef.current = today1
        findUser();
        const unsubscribe = props.navigation.addListener('focus', () => {


            if (props.user.profile.occupation == "Doctor") {
                getPrescription()

            }



        });

        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
            unsubscribe
        };
    }, [])

   const searchPriscriptions = async(text) => {
       if (typeof cancelToken != typeof undefined) {
          cancelToken.cancel('cancelling the previous request')
       }
       cancelToken = axios.CancelToken.source()
       let api = `${url}/api/prescription/prescriptions/?forUser=${props.user.id}&usersearch=${text}`
       const data = await axios.get(api, { cancelToken:cancelToken.token });
       setPrescriptions(data.data)
    }
   const getClinics = async () => {
         
        const api = `${url}/api/prescription/getDoctorClinics/?doctor=${props.user.id}`
        const data = await HttpsClient.get(api)
        console.log(api,"clinic api")
        if (data.type == "success") {
         
            props.selectWorkingClinics(data.data.workingclinics)
            props.selectOwnedClinics(data.data.ownedclinics)
            setClinics(data.data.workingclinics)
            let activeClinic = data.data.workingclinics.filter((i) => {
                return i.active
            })
            console.log(activeClinic[0],"accc")
            props.selectClinic(activeClinic[0] || data.data.workingclinics[0])
            if (!props?.clinic?.validtill?.available){
                 setExpiryModal(true)
            }else{
                 setExpiryModal(false)
            }
        }
      
    }
  const  chatClinic = async (item) => {
     
      
        let api = `${url}/api/prescription/createClinicChat/?clinic=${item.clinic}&customer=${props.user.id}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            props.navigation.navigate('Chat', { item: data.data })
        }
    }
  const  getPrescription = async () => {
      setLoading(true)
      let api = `${url}/api/prescription/prescriptions/?doctor=${props.user.id}&date=${stateRef.current}&clinic=${clinicRef.current.clinicpk}`
        console.log(api,"prescription api")
        let data = await HttpsClient.get(api)
//   console.log(data.data)
        if (data.type == 'success') {
            setPrescriptions(data.data)
            setLoading(false)
            setIsFetching(false)
           
        }
 
    }
    const findUser =()=>{
        if (props.user.profile.occupation == "Doctor") {
            getClinics()
         
            setIsDoctor(true)
        } else if (props.user.profile.occupation == "ClinicRecoptionist") {
            props.selectClinic(props.user.profile.recopinistclinics[0])
           getClinicPrescription()
           setIsReceptionist(true)
           
        }
        else {
          getPateintPrescription()
        }
       
       
    }
  const  getPateintPrescription = async () => {
      
      let api = `${url}/api/prescription/prescriptions/?forUser=${props.user.id}`
        let data = await HttpsClient.get(api)
        console.log(api)
        if (data.type == "success") {
            setLoading(false)
            setPrescriptions(data.data)
            
        }
        setIsFetching(false)
    }
  const  getClinicPrescription = async () => {
      setLoading(true)
      console.log(props.user.profile.recopinistclinics,"pppp")
        let api = `${url}/api/prescription/prescriptions/?clinic=${props.user.profile.recopinistclinics[0].clinicpk}&date=${moment(date).format("YYYY-MM-DD")}`
        let data = await HttpsClient.get(api)
        console.log(api)
        if (data.type == 'success') {
            setPrescriptions(data.data)
            setLoading(false)
            setIsFetching(false)
      
        }

    }

 const   setActiveClinic = async (item) => {
        const api = `${url}/api/prescription/clinicDoctors/${item.pk}/`
        let sendData = {
           active:true
        }
        let patch = await HttpsClient.patch(api, sendData)
        if (patch.type == "success") {

            props.selectClinic(item)
            setShowModal(false)
            
        }
       
    }

  const  showDatePicker = () => {
      setShow(true)
    };

   const hideDatePicker = () => {
       setShow(false)
  
    };
   

const _keyboardDidShow =()=>{
    setButton(false);

}
    const _keyboardDidHide =()=>{
        setButton(true);
    }

   const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        setToday(moment(date).format('YYYY-MM-DD'))
        setShow(false)
        setDate(new Date(date))
       stateRef.current = moment(date).format('YYYY-MM-DD')
        // this.setState({ , show: false, date:  }, () => {
        //     if (this.state.isDoctor) {
        //         this.getPrescription()
        //     } else {
        //         this.getClinicPrescription()
        //     }

        // })
       hideDatePicker();
    };
   const renderFilter = () => {
        if (isDoctor || isReceptionist) {
            return (

                <View style={{ alignItems: "center", justifyContent:"center" ,width:width*0.32,}}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{alignItems:"center",justifyContent:"center"}}>
                            <Text style={[styles.text, { color: "#fff" }]}>{today}</Text>
                        </View>
                        
                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={()=>{setShow(true)}}
                        >
                            <Fontisto name="date" size={24} color={"#fff"} />
                        </TouchableOpacity>
 

                        <DateTimePickerModal
                            isVisible={show}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
              
                </View>

            )
        }else{
            return null
        }
    }

 const   validateHeaders =()=>{
     console.log(props?.clinic?.name)
   if(isDoctor||isReceptionist){
       return (
           <View>
               <View style={{ height: headerHeight / 2, flexDirection:"row",flex:1}}>
                   <TouchableOpacity style={{ flexDirection: "row", alignItems: "center",width:width*0.68,justifyContent:"space-around"}}
                    onPress ={()=>{setShowModal(true)}}
                   >
                       <View>
                           {isDoctor?<Text style={[styles.text, { fontSize: 25, color: "#fff", fontWeight: "bold", marginLeft: 5 }]} numberOfLines={1}>{props?.clinic?.name }</Text>:
                               <Text style={[styles.text, { fontSize: 25, color: "#fff", fontWeight: "bold", marginLeft: 5 }]} numberOfLines={1}>{props?.user?.profile?.recopinistclinics[0]?.clinicname}</Text>
                           }
                          
                       </View>
                    
                        <View style={{alignItems:"center",justifyContent:"center"}}>
                               {isDoctor && <Entypo name="chevron-small-down" size={30} color="#fff" />}
                        </View>
                           
              
                   </TouchableOpacity>
                   {
                       renderFilter()
                   }
               </View>

               <View style={{ marginHorizontal: 20, height: headerHeight / 3, alignItems: 'center', justifyContent: "center", marginBottom: 5 }}>
                   <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height: height * 0.05, }}
                       onPress={() => { props.navigation.navigate('SearchPatient')}}
                   >
                       <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                           <EvilIcons name="search" size={24} color="black" />
                       </View>
                       <View style={{alignItems:"center",justifyContent:"center"}}>
                           <Text style={[styles.text]}>Search Patient</Text>
                       </View>
                     
                   </TouchableOpacity>

               </View>
           </View>

       )
    
   }
     return (
         <View>
             <View style={{ height: headerHeight / 2, justifyContent:"center"}}>
                 <Text style={{ color: '#fff', fontFamily: "openSans", marginLeft: 20, fontSize: 30, fontWeight: "bold" }}>Prescription</Text>
             </View>

             <View style={{ marginHorizontal: 20, height: headerHeight / 3, alignItems: 'center', justifyContent: "center", marginBottom: 5 }}>
                 <View style={{ flexDirection: 'row', borderRadius: 10, backgroundColor: "#eee", width: "100%", height: height * 0.05, }}>
                     <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5, flex: 0.1 }}>
                         <EvilIcons name="search" size={24} color="black" />
                     </View>
                     <TextInput

                         selectionColor={themeColor}
                         style={{ height: "90%", flex: 0.8, backgroundColor: "#eee", paddingLeft: 10, marginTop: 3 }}
                         placeholder="search"
                         onChangeText={(text) => { searchPriscriptions(text) }}
                     />
                 </View>

             </View>
         </View>
     )
 }
  const  showDifferentPriscription = (item, index) => {
     
        if (isDoctor) {

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    // onPress={() => { props.navigation.navigate('showCard', { item }) }}
                  onPress={() => { props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{flex:0.3,alignItems:'center',justifyContent:'center'}}>
                       <Image 
                         style={{height:"90%",width:"95%",resizeMode:"cover",borderRadius:10}}
                            source={{uri:"https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription-1024x1024.png"}}
                       />
                    </View>
                    <View style={{flex:0.7,marginHorizontal:10,justifyContent:'center'}}>
                        <View style={{marginTop:10,flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username?.name}</Text>

                            </View>
                            <View style={{alignItems:"center",justifyContent:"center"}}>
                                <Text>#{getIndex(index)}</Text>
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <View>
                                <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}}>
                           <View>
                                <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                           </View>
                           <View>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>
                           </View>
                        </View>
                    </View>
              
                </TouchableOpacity>
            )
        }
        if (isReceptionist) {

            let dp = null
            if (item?.doctordetails?.dp) {
                dp = `${url}${item?.doctordetails?.dp}`
            }

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    onPress={() => { props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: "90%", width: "95%", resizeMode: "cover", borderRadius: 10 }}
                            source={{ uri: "https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription-1024x1024.png" }}
                        />
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username}</Text>

                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{getIndex(index)}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View>
                                <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                            </View>
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
            <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                onPress={() => { props.navigation.navigate('PrescriptionView', { item, }) }}
            >
                <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      
                        style={{ height: "90%", width: "95%", resizeMode:"contain", borderRadius: 10 }}
                        source={{ uri: `${url}/static/images/mainPrescription.jpeg`}}
                    />
                </View>
                <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center' }}>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.text, { color: "#000", fontWeight: 'bold' }]}>Patient : {item?.username.name}</Text>

                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text>#{getIndex(index)}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View>
                            <Text style={[styles.text]}>Reason : {item.ongoing_treatment}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                        <View>
                            <Text style={[styles.text]}>Clinic :{item.clinicname.name}</Text>
                        </View>
                        <View>
                            <View style={{alignSelf:"flex-end"}}>
                                <Text style={[styles.text]}>{moment(item.created).format("h:mm a")}</Text>

                            </View>
                            <View>
                                <Text style={[styles.text]}>{moment(item.created).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                      
                    </View>
                    <View style={{flexDirection:"row",marginTop:10}}>
                         <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => { chatClinic(item)}}
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
                   
                </View>
            </TouchableOpacity>
        )
    }
    const renderFooter =()=>{
        if(loading){
            return (
                <View>
                    <ActivityIndicator size={"large"} color={themeColor} />
                </View>
            )
        }
       return null
    }
 
   const onRefresh = () => {
       setIsFetching(true)
        if (isDoctor) {
            getPrescription()
        } else if (isReceptionist) {
          getClinicPrescription()
        } else {
         getPateintPrescription()
        }
    }
//    console.log(props.ownedClinics,"ooooo")
    return (
        <SafeAreaView style={styles.container}>
      
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
               {
                   validateHeaders()
               }
              
            </Animated.View>
            <Animated.View style={{flex:1,}}>
                <StatusBar backgroundColor={themeColor} style="light" />
                <Animated.FlatList
                    keyExtractor={(item, index) => index.toString()}
                     refreshControl ={
                         <RefreshControl 
                            onRefresh={() => onRefresh()}
                            refreshing={isFetching}
                            progressViewOffset={headerHeight}
                         />
                     }
                    ListFooterComponent={renderFooter}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingTop: headerHeight ,paddingBottom:90}}
                    onScroll={handleScroll}
                    ref={ref}
                    onMomentumScrollEnd={handleSnap}
                    data={prescriptions}
                    renderItem={({ item, index }) => {
                        return (
                          <View>
                              {
                                  showDifferentPriscription(item,index)
                              }
                          </View>
                       


                        )


                    }}
                  
                  
         
                
                />

            </Animated.View>
            { isDoctor &&button&&<View style={{
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
                    onPress={() => { props.navigation.navigate('addPriscription') }}
                >
                    <AntDesign name="pluscircle" size={40} color={themeColor} />
                </TouchableOpacity>
            </View>}
            <Modal
                deviceHeight={screenHeight}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={showModal}
                onBackdropPress={() => { setShowModal(false) }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                            <Text style={[styles.text, { color: "#000", fontWeight: "bold", fontSize: 16 }]}>Select Clinic</Text>
                        </View>
                        <FlatList
                            data={clinics}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width:"100%" ,}}
                                        onPress={() => { setActiveClinic(item) }}
                                    >
                                        <View style={{width:"80%",alignItems:"center",justifyContent:'center',}}>
                                            <Text style={[styles.text]}>{item.name}</Text>
                                        </View>
                                       
                                        <View style={{width:"20%",alignItems:"center",justifyContent:"center",}}>
                                            <FontAwesome name="dot-circle-o" size={24} color={props.clinic == item ? themeColor : "gray"} />

                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />

                    </View>
                </View>
            </Modal>
            <Modal
                statusBarTranslucent={true}
                deviceHeight={screenHeight}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={expiryModal}
                onBackdropPress={()=>{setExpiryModal(false)}}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                        <View>
                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Your Subscription has been expired!</Text>
                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 ,textAlign:"center"}]}>Please Recharge to continue</Text>
                        </View>
                       <TouchableOpacity
                            onPress={() => {
                                setExpiryModal(false)
                              return  props.navigation.navigate('PaymentPage')
                            }}
                         style={{height:height*0.05,width:width*0.4,alignItems:"center",justifyContent:'center',backgroundColor:themeColor,borderRadius:5}}
                       >
                            <Text style={[styles.text,{color:"#fff"}]}>Recharge</Text>
                       </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor:themeColor,
        elevation:6
    },
    subHeader: {
        height: headerHeight / 2,
        width: '100%',
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text: {
        fontFamily
    },
    root: {
        flex: 1,
        marginHorizontal: 20
    },
    container: {
        flex: 1
    },
    content: {
        height: height * 2
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation:5,
        borderRadius:10,
        backgroundColor: "#fff",
        height: height * 0.2,
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
        user: state.selectedUser,
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics })(Priscription)
