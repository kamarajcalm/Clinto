import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Dimensions,
    Image,
    Settings,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Linking,
    Platform,
    StatusBar,
    ActivityIndicator,
    AsyncStorage,
    ScrollView,
    TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
const width = Dimensions.get("screen").width
const height = Dimensions.get("screen").height
const screenHeight = Dimensions.get("screen").height

import { connect } from 'react-redux';
import { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics ,setNoticationRecieved} from '../actions';
import settings from '../AppSettings'
import moment from 'moment';
const url = settings.url
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import HttpsClient from '../api/HttpsClient';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
// import Image from 'react-native-scalable-image';
class RequestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
           item:null
        };
    }
    onSwipe(gestureName, gestureState) {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
        switch (gestureName) {
            // case SWIPE_UP:
            //     this.props.navigation.goBack()
            //     break;
            // case SWIPE_DOWN:
            //     this.props.navigation.goBack()
            //     break;
            // case SWIPE_LEFT:
            //     this.props.navigation.goBack()
            //     break;
            case SWIPE_RIGHT:
                this.props.setNoticationRecieved(null)
                this.props.navigation.goBack()
                break;
        }
    }
       getDetails = async () => {
         let api = `${url}/api/prescription/prescriptions/${this.props.route.params.item.prescription}/`
         const data = await HttpsClient.get(api)
         console.log(api)
         if (data.type == "success") {
             this.setState({ item: data.data })
         }
     }
    componentDidMount(){
      this.getDetails()
    }
         sepeartor =()=>{
    return(
        <View>
            <Text style={[styles.text,{color:"#000"}]}> , </Text>
        </View>
    )
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
     renderHeader = () => {
         return (
             <View style={{flex:1}}>
                     <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                            <View style={{flexDirection:"row"}}>
                                  <View>
                                             <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>Reason : </Text>
                                  </View>
                                  <View>
                                             <Text style={[styles.text, {fontSize:height*0.02}]}>{this.state?.item?.ongoing_treatment}</Text>
                                  </View>
                            </View>
                            <View style={{flexDirection:"row"}}>
                                           <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>Diagnosis : </Text>
                                           <View>
                                                   <FlatList 
                                        horizontal={true}
                                        data={this.state?.item?.diseaseTitle}
                                        keyExtractor={(item,index)=>index.toString()}
                                        ItemSeparatorComponent={this.sepeartor}
                                        renderItem ={({item,index})=>{
                                                return(
                                                <View style={{ alignItems: "center", justifyContent: "center" ,flexDirection:"row"}}>
                                                    <Text style={[styles.text, {color:"#000",fontSize:height*0.02}]}>{item}</Text>
                                                </View>
                                                )
                                        }}
                    
                                    />
                                           </View>
                                 
                    </View>
                     </View>
            
             </View>
            //  <View>
            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, { color: "#000", }]}>Reason : </Text>
            //          </View>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, {}]}>{this.state?.item?.ongoing_treatment}</Text>
            //          </View>
            //      </View>
            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10 }}>
            //          <View style={{ alignItems: "center", justifyContent: "center" }}>
            //              <Text style={[styles.text, { color: "#000", }]}>Diagnosis : </Text>
            //          </View>
               
                //  </View>

            //      <View style={{ marginHorizontal: 20, flexDirection: "row", marginTop: 10, alignItems: "center", justifyContent: "space-around" }}>
              
            //      </View>
            //  </View>
         )
     }
   header =() =>{
     return(
       <View style={{flexDirection:"row",marginTop:5}}>
          <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
              <Text style={[styles.text,{color:"#000"}]}>#</Text>
          </View>
          <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                <Text style={[styles.text,{color:"#000"}]}>Name</Text>
          </View>
          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
               <Text style={[styles.text,{color:"#000"}]}>Qty</Text>
          </View>
       </View>
     )
   }
    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        const { item } = this.state
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} />
                     <View style={{ height: height * 0.1, backgroundColor:themeColor,flexDirection:"row"}}>
                     <View style={{flex:0.7}}>
                         <View style={{flex:0.5,justifyContent:"center",marginLeft:20}}>
                            <Text style={[styles.text,{color:"#ffff",fontWeight:'bold',fontSize:height*0.03}]}>{this.state?.item?.clinicname?.name?.toUpperCase()}</Text>

                         </View>
                         <View style={{flex:0.5,marginLeft:20,}}>
                             <View>
                                   <Text style={[styles.text,{color:"#fff",fontSize:height*0.017}]}>{this.state?.item?.clinicname?.address}</Text>
                             </View>
                         
                            <View style={{ }}>
                                <Text style={[styles.text, { color: "#fff" ,fontSize:height*0.017}]}>{this.state?.item?.clinicname?.city}-{this.state?.item?.clinicname?.pincode}</Text>
                            </View>
                         </View>
                        
                     </View>
                     <View style={{flex:0.3,alignItems:'center',justifyContent:'center'}}>
                          <Image 
                            style={{height:'80%',width:'80%',resizeMode:"contain"}}
                            source={{ uri:"https://i.pinimg.com/originals/8d/a6/79/8da6793d7e16e36123db17c9529a3c40.png"}}
                          />
                     </View>
                </View>
                    <GestureRecognizer
                        onSwipe={(direction, state) => this.onSwipe(direction, state)}
                        config={config}
                        style={{
                            flex: 1,
                            backgroundColor: "#fff"
                        }}
                    >


                        <View style={{ flex: 1 }}>
                               <View style={{ flex: 0.15,borderColor:"#eee",borderBottomWidth:0.5,}}>
                        <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                             <View style={{flexDirection:'row'}}>
                               <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Name : </Text>
                               </View>
                                <View>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{this.state?.item?.username.name}</Text>
                                </View>
                           </View>
                               <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Age : </Text>
                                </View>
                                <View>
                                        <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>{this.state?.item?.username.age}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Sex : </Text>
                                </View>
                                <View>
                                    <Text style={[styles.text, { color: "#000",fontSize:height*0.02}]}>{this?.state?.item?.sex}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:0.5,alignItems:"flex-end",paddingRight:20}}>
                            <Text style={[styles.text,{fontSize:height*0.02}]}>Prescription No:{this.state?.item?.id}</Text>
                            <Text style={[styles.text,{textAlign:"right",fontSize:height*0.016}]}>{moment(this.state?.item?.created).format('DD/MM/YYYY')}</Text>
                        </View>
                       
                    </View>

                         <View style={{flex:0.1,borderColor:"#eee",borderBottomWidth:0.5}}>
                            {
                                this.renderHeader()
                            }
                    </View>
                            <View style={{ flex: 0.58, }}>
                                <FlatList 
                                   ListHeaderComponent={this.header()}
                                   data={this.props.route.params.item.medicineDetails}
                                   keyExtractor={(item,index)=>index.toString()}
                                   renderItem ={({item,index})=>{
                                      return(
                                            <View style={{flexDirection:"row",marginTop:10}}>
                                                    <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={[styles.text,{color:"#000"}]}>{index+1}</Text>
                                                    </View>
                                                    <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                          <Text style={[styles.text,{color:"#000"}]}>{item.medicinetitle}</Text>
                                                    </View>
                                                    <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={[styles.text,{color:"#000"}]}>{item.quantity}</Text>
                                                    </View>
                                           </View>
                                      )
                                   }}
                                /> 
                               
                            </View>
                            <View style={{ flex: 0.1, }}>
                                <View style={{ flex: 0.5 }}>

                                </View>
                                <View style={{ alignSelf: 'flex-end', flex: 0.5, alignItems: "flex-end", justifyContent: "center", marginRight: 10 }}>
                                    <View>
                                        <Text style={styles.text}>Dr.{this.state?.item?.doctordetails?.name}</Text>

                                    </View>
                                    <View>
                                        <Text style={styles.text}>{this.state?.item?.doctordetails?.specialization}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.text}>{this.state?.item?.doctordetails?.mobile}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 0.07, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center", justifyContent: "space-around" }}>
                                <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center', justifyContent: "center" }}
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state.appDetails?.mobile}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state.appDetails?.mobile}`)
                                        }
                                    }}
                                >
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="phone" size={24} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.clinicname?.mobile}</Text>
                                    </View>
                                </TouchableOpacity >
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                        <Feather name="mail" size={24} color="#fff" />
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                        <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.clinicname?.email}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </GestureRecognizer>
                  
                </SafeAreaView>

            </>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    text: {
        fontFamily,
    },
    topSafeArea: {
        flex: 0,
        backgroundColor: "#5081BC"
    },
    bottomSafeArea: {
        flex: 1,
        backgroundColor: "#fff"
    },
    elevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,
        elevation: 6,
    }
});

const mapStateToProps = (state) => {
    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics, setNoticationRecieved })(RequestView)