import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList, ImageBackground,Alert} from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const screenHeight = Dimensions.get("screen").height
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome} from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
const url =settings.url;
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import { selectTheme, selectClinic,selectUser,setShowLottie} from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';

import HttpsClient from '../api/HttpsClient';



 class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
      showClinics:false,
      clinics:[],
      isDoctor:false,
      isReceptionist:false,
      isPatient:false,
      showLottie:false,
     
    };
  }

   logOut =()=>{
     this.setState({showModal:false},()=>{
       AsyncStorage.clear();
       AsyncStorage.removeItem('login')

       this.props.navigation.dispatch(
         CommonActions.reset({
           index: 0,
           routes: [
             {
               name: 'DefaultScreen',

             },

           ],
         })
       )
       this.props.selectClinic({})
     })
  
  
   }
   ClinicSelect =()=>{
     this.setState({showClinics:true})
   }
   getClinics = async () => {
     const api = `${url}/api/prescription/getDoctorClinics/?doctor=${this.props.user.id}`
     console.log(api,"kooo")
     const data = await HttpsClient.get(api)

     if (data.type == "success") {
       this.setState({ clinics: data.data})
       let activeClinic = data.data.workingclinics.filter((i) => {
         return i.active
       })
       this.props.selectClinic(activeClinic[0] || data.data.workingclinics[0])
     }
   }
   findUser = () => {
     if (this.props.user.profile.occupation == "Doctor") {
       this.getClinics()
       this.setState({ isDoctor: true, })
     } else if (this.props.user.profile.occupation == "ClinicRecoptionist") {
       this.setState({ isReceptionist: true, })
    }
    else {
       this.setState({ isPatient: true, })
     }

   
   }
   getDetails =async()=>{
     const data = await HttpsClient.get(`${url}/api/HR/users/?mode=mySelf&format=json`);
     console.log(data)
     if (data.type == "success"){
       this.props.selectUser(data.data[0]);
     }
   }
   validateLottie =()=>{
       if(this.props.showLottie){
         this.animation.play();
       }
   }
componentDidMount(){
   console.warn(this.props.showLottie)
  this.findUser()
 
  this._unsubscribe = this.props.navigation.addListener('focus', () => {
    this.validateLottie()
      this.getDetails()
    if (this.props.user.profile.occupation == "Doctor") {
      this.getClinics()
      this.setState({ isDoctor: true, })
    }
  });

}
componentWillUnmount(){
  this._unsubscribe()
}
   setActiveClinic = async (item) => {
     const api = `${url}/api/prescription/doctorActive/`
     let sendData = {
       previous_clinic: this.props.clinic.pk,
       current_clinic: item.pk
     }
     let patch = await HttpsClient.post(api, sendData)
     console.log(patch,"kkkk")
     if (patch.type == "success") {

       this.props.selectClinic(item)
       this.setState({ showClinics: false })
     }

   }
validateExpiry =()=>{
  if (this.props?.clinic?.validtill?.validTill){
    return (
      <View style={{ flexDirection: "row", marginTop: 5 }}>
        <Feather name="calendar" size={24} color={"gray"} />
        <Text style={[styles.text, { color: themeColor, fontSize: 20 }]}>{this.props?.clinic?.validtill?.validTill || "Recharge"}</Text>
      </View>
    )
  }
  return(
    <View style={{ flexDirection: "row", marginTop: 5 }}>
           <Text style={[styles.text,{color:"red"}]}> expired Recharge</Text>
    </View>
  )
  
}
   diffrentiateUsers =()=>{
     if(this.state.isDoctor){
       return (
         <>
           {/* <View style={{ height: height * 0.15, alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>
             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
               <Text style={[styles.text]}>Total patients</Text>
               <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>100</Text>
             </View>
             <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}
              onPress={()=>{
                this.props.navigation.navigate('PaymentPage')
              }}
             
             >
               <Text style={[styles.text]}>Subscription Valid Till</Text>
               {

                 this.validateExpiry()
               }

             </TouchableOpacity>
           </View> */}
           <DoctorProfile ClinicSelect={() => { this.ClinicSelect() }} clinics ={this.state.clinics} navigation={this.props.navigation}/>
         </>
       )
     }
     if(this.state.isReceptionist){
       return(
         <>
           {/* <View style={{ height: height * 0.15, alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>
             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
               <Text style={[styles.text]}>Total patients</Text>
               <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>100</Text>
             </View>
             <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
               <Text style={[styles.text]}>Priscription Valid Till</Text>
              {
                this.validateExpiry()
              }

             </TouchableOpacity>
           </View> */}
           <ReceptionistsProfile />
         </>
       )
     }
     if(this.state.isPatient){
       return(
         <>
           <PatientProfile  navigation={this.props.navigation}/>
         </>
       )
    
     }
    
   }
   lottieModal =()=>{
      return(
        <Modal
          onBackdropPress={()=>{
            this.props.setShowLottie(false)
            this.animation.false
          }}
          deviceHeight={screenHeight}
          isVisible={this.props.showLottie}
          statusBarTranslucent={true}
        >
            <View style={{height:height*0.6,alignItems:"center",justifyContent:"center"}}>
            <LottieView
           
              ref={animation => {
                this.animation = animation;
              }}
              style={{
                width: 400,
                height: 400,
               
              }}
              source={require('../assets/lottie/success.json')}
            // OR find more Lottie files @ https://lottiefiles.com/featured
            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
            />
            <View style={{ position: "absolute",bottom:90 }}>
              <Text style={[styles.text, { color: "#fff" }]}>Recharge Success</Text>
            </View>
              <View>
                   
                  <TouchableOpacity
                onPress={() => {
                  this.animation.pause();
                  this.props.setShowLottie(false)
                }}
                    style={{ height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 5 }}
                  >
                    <Text style={[styles.text, { color: "#000" }]}>OK</Text>
                  </TouchableOpacity>
              </View>
        
             </View> 
        </Modal>
      )
   }
   backFunction =()=>{

   }
      createAlert = (item, index) => {
    Alert.alert(
      "Do you want to Log out?",
      ``,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.logOut() } }
      ]
    );

  }
  render() {
    console.log(this.props.user.profile.displayPicture)
    return (
      
     <>
        <SafeAreaView style={styles.topSafeArea} />
        <SafeAreaView style={styles.bottomSafeArea}>
        <View style={{ flex:1,backgroundColor:"#fefefe"}}>
           


        <ScrollView
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
             
            <ImageBackground 
              blurRadius={1}
              style ={{height:height*0.3,alignItems:"center",}}
              source={require('../assets/Doctor.png')}
              
          >
                 {/* headers */}
           <View style={{alignSelf:"flex-end",marginRight:10,marginTop:10}}>
            <TouchableOpacity style={{  marginLeft: 20, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}
              onPress={() => { 
                if(this.props.user.profile.childUsers.length>0){
                      this.setState({ showModal: true })
                }else{
                   this.createAlert()
                }
               }}
            >
          
              <MaterialCommunityIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
           </View>
         <View style={{alignItems:"center",justifyContent:"center",flex:1}}>

              <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", marginLeft: 20 }}>
                <Image
                  source={{ uri: this.props.user.profile.displayPicture || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                  style={{ height:height*0.15, width: height*0.15, borderRadius: height*0.07}}
                />
                <TouchableOpacity style={{}}
                  onPress={() => { this.props.navigation.navigate('ProfileEdit') }}
                >
                  <Entypo name="edit" size={20} color={themeColor} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', justifyContent: "center", }}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.022, color: "#000" }]}>{this.props.user.first_name}</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: "center", }}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.022, color: "gray" }]}>{this.props.user.profile.specialization}</Text>
              </View>
           </View>  
       
          </ImageBackground>


                               {/* STATISTICS */}
                      
                <View style={{marginHorizontal:20,elevation:5,backgroundColor:"#fafafa",borderRadius:15}}>
                    <View style={{borderWidth:2,alignSelf:'center',borderColor:"gray",width:width*0.3,marginVertical:10,borderRadius:10}}>
                  
                    </View>
                    <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                        <Text style={[styles.text,{color:"#000"}]}>Vaccination Details : </Text>
                    </View>
                    <View style={{marginTop:10,marginLeft:10}}>
                        <Text style={[styles.text,{color:"#000"}]}>Vaccinated : Yes</Text>
                    </View>
                     <View style={{marginVertical:10,marginLeft:10}}>
                        <Text style={[styles.text,{color:"#000"}]}>Next Vaccination on : 12/12/2021</Text>
                    </View>
                </View>
          { this.state.isPatient&& <View style={{marginHorizontal:20,elevation:5,backgroundColor:"#fafafa",borderRadius:15,marginTop:20}}>
                 
                     <View style={{paddingVertical:20 }}>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={{ marginTop: 5,flexDirection:"row",alignItems:"center",justifyContent:"space-between" }}>
                            <View style={{}}>
                                                   <Text style={[styles.text]}>Delivery Location</Text>
                            </View>
                             <View style={{}}>
                                 <TouchableOpacity style={{height:height*0.03,width:width*0.25,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                   onPress={()=>{
                                        this.props.navigation.navigate("SelectAddress", { backFunction: (address) => { this.backFunction(address)}})
                                   }}
                                 >
                                       <Text style={[styles.text,{color:"#fff",fontSize:height*0.02}]}>Change</Text>
                                 </TouchableOpacity>
                             </View>
                             
                        </View>
                        <View>
                              <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.location}</Text>
                        </View>
               
                    </View>


                </View>
               <TouchableOpacity style={{ borderColor: "#F0F0F0", borderTopWidth: 3,paddingVertical:20 }}
                onPress={()=>{this.props.navigation.navigate("CustomerOrders")}}
               >
                    <View style={{ marginHorizontal: 20 ,flexDirection:"row",marginVertical:10,alignItems:"center",justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row"}}>
                            <View>
                              <AntDesign name="gift" size={24} color={themeColor} />
                            </View>
                                <View style={{ marginLeft:10,marginTop:5}}>
                                    <Text style={[styles.text]}>Your Orders</Text>
                                </View>
                        </View>
                    
                      
                    </View>


                </TouchableOpacity>
                          <TouchableOpacity style={{ borderColor: "#F0F0F0", borderTopWidth: 3,paddingVertical:20 }}
                onPress={()=>{this.props.navigation.navigate("PendingRequests")}}
               >
                    <View style={{ marginHorizontal: 20 ,flexDirection:"row",marginVertical:10,alignItems:"center",justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row"}}>
                            <View>
                            <AntDesign name="questioncircle" size={24} color={themeColor}/>
                            </View>
                                <View style={{ marginLeft:10,marginTop:5}}>
                                    <Text style={[styles.text]}>Pending Requests</Text>
                                </View>
                        </View>
                 
                      
                    </View>


                </TouchableOpacity>
                                   <TouchableOpacity style={{ borderColor: "#F0F0F0", borderTopWidth: 3,paddingVertical:20 }}
                onPress={()=>{this.props.navigation.navigate("LinkedAccounts")}}
               >
                    <View style={{ marginHorizontal: 20 ,flexDirection:"row",marginVertical:10,alignItems:"center",justifyContent:"space-between"}}>
                        <View style={{flexDirection:"row"}}>
                            <View>
                                 <Ionicons name="person-add" size={24} color={themeColor} />
                            </View>
                                <View style={{ marginLeft:10,marginTop:5}}>
                                    <Text style={[styles.text]}>Linked Accounts</Text>
                                </View>
                        </View>
                  
                      
                    </View>


                </TouchableOpacity>
                </View>}
            </ScrollView>
                         {/* Modal */}
                  <View>
                    <Modal
                       statusBarTranslucent={true}
                       deviceHeight ={screenHeight}
                         animationIn="slideInUp"
                         animationOut="slideOutDown"
                         isVisible={this.state.showModal}
                         onBackdropPress={() => { this.setState({ showModal: false }) }}
                      >
                        <View style={{ flex:1,alignItems:'center',justifyContent:'center'}}>
                             <View style={{height:height*0.4,width:width*0.9,backgroundColor:"#fff",borderRadius:20,alignItems:"center",justifyContent:"space-around"}}>
                                  <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:themeColor,fontSize:height*0.02}]}>Change Account</Text>
                                  </View>
                                  <View style={{flex:0.6,width:width*0.9}}>
                              
                                            <FlatList 
                                            showsVerticalScrollIndicator={false}
                                    data={this.props.user.profile.childUsers}
                                    keyExtractor={(item,index)=>index.toString()}
                                    renderItem={({item,index})=>{
                                      
                                         return(
                                           <TouchableOpacity style={{flexDirection:"row",flex:1,marginTop:10}}
                                            onPress={()=>{this.props.navigation.navigate('LoginScreen',{item})}}
                                           >
                                               <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                  <Ionicons name="person-circle-sharp" size={30} color={themeColor}/>
                                               </View>
                                               <View style={{flex:0.8}}>
                                                     <View style={{justifyContent:"center",paddingTop:5}}>
                                                         <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.name}</Text>
                                                       </View>  
                                               </View>
                                           </TouchableOpacity>
                                         )
                                    }}
                                  />
                                  </View>
                            
                                  <View style={{alignItems:"center",justifyContent:"center",flex:0.2,flexDirection:"row"}}>
                                      <TouchableOpacity style={{height:height*0.04,width:width*0.3,alignItems:"center",justifyContent:"center",backgroundColor:themeColor,borderRadius:5}}
                                       onPress={()=>{this.logOut()}}
                                      >
                                           <Text style={[styles.text,{color:"#fff"}]}>Log Out</Text>
                                      </TouchableOpacity>
                                  </View>
                             </View>
                        </View>
                      </Modal>
              <Modal
                deviceHeight={screenHeight}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={this.state.showClinics}
                onBackdropPress={() => { this.setState({ showClinics: false }) }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                  <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                      <Text style={[styles.text, { color: "#000", fontWeight: "bold", fontSize: 16 }]}>Select Clinic</Text>
                    </View>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={this.state.clinics.workingclinics}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width }}
                            onPress={() => { this.setActiveClinic(item) }}
                          >
                            <Text style={[styles.text]}>{item.name}</Text>
                            <View >
                              <FontAwesome name="dot-circle-o" size={24} color={this.props.clinic.clinicpk == item.clinicpk? themeColor : "gray"} />

                            </View>
                          </TouchableOpacity>
                        )
                      }}
                    />

                  </View>
                </View>
              </Modal>
              
                  </View>
      </View>
             {
               this.lottieModal()
             }
        </SafeAreaView>
      </>
    );
  }
}
const styles =StyleSheet.create({
   text:{
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
    user:state.selectedUser,
    clinic:state.selectedClinic,
    showLottie:state.showLottie
  }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectUser, setShowLottie})(Profile)