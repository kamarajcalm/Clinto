import React, { Component } from 'react';
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
    Linking,
   Alert,
   AsyncStorage
    

} from "react-native";
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign,MaterialIcons} from '@expo/vector-icons';
import Modal from "react-native-modal";
import { connect } from 'react-redux';
import { selectTheme ,selectClinic, selectWorkingClinics, selectOwnedClinics, setNoticationRecieved} from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const { height, width } = Dimensions.get("window");
const screenHeight = Dimensions.get("screen").height
const fontFamily = settings.fontFamily;
const inputColor =settings.TextInput
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HttpsClient from '../../api/HttpsClient';
import LottieView from 'lottie-react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

const url = settings.url;

class ViewReports extends Component {

    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
           item
        };
    }
     validateAnimations = async () => {
         let swipeTut = await AsyncStorage.getItem("swipeTut")
         if (swipeTut == null) {
             AsyncStorage.setItem("swipeTut", "true")
             this.setState({ lottieModal: true }, () => {
                 this.animation.play()
             })
         }
     }
   componentDidMount(){
         this.validateAnimations();
         Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
         Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    
      }
        _keyboardDidShow = (e) => {
            console.log()
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
   componentWillUnmount(){
     
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
   }
          showSimpleMessage(content,color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor:color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
getTotal =()=>{
 const total =  this.state.item.subReports.reduce((total,item)=>{
     return total+item.price
 },0)
//  console.log(total)
 return total
}
   onSwipe(gestureName, gestureState) {
         const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
         this.setState({ gestureName: gestureName });
         switch (gestureName) {

             case SWIPE_LEFT:
                 this.props.setNoticationRecieved(null)
                 this.props.navigation.goBack()
                 break;
             case SWIPE_RIGHT:
                 this.props.setNoticationRecieved(null)
                 this.props.navigation.goBack()
                 break;
         }
     }
          lottieModal = () => {
         const config = {
             velocityThreshold: 0.3,
             directionalOffsetThreshold: 80
         };
         return (
             <Modal
                 statusBarTranslucent={true}
                 deviceHeight={screenHeight}
                 isVisible={this.state.lottieModal}
             >

                 <View style={{ height: height * 0.7, alignItems: "center", justifyContent: "center" }}>

                     <LottieView
                         ref={animation => {
                             this.animation = animation;
                         }}
                         style={{


                             width: width,
                             height: height * 0.4,

                         }}
                         source={require("../../assets/lottie/swipe-gesture-right.json")}
                     // OR find more Lottie files @ https://lottiefiles.com/featured
                     // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                     />
                     <View style={{ position: "relative", top: -100, }}>
                         <View>
                             <Text style={[styles.text, { color: "#fff", marginTop: -40 }]}>swipe to go back</Text>
                         </View>
                         <TouchableOpacity style={{ height: height * 0.05, width: width * 0.2, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 5, marginLeft: 20 }}
                             onPress={() => {
                                 this.animation.pause();
                                 this.setState({ lottieModal: false })

                             }}
                         >
                             <Text style={[styles.text, { color: "#000" }]}>ok</Text>
                         </TouchableOpacity>
                     </View>

                 </View>

             </Modal>

         )
     }
      renderHeader = () => {
         return (
             <View style={{flex:1}}>
                     <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                            <View style={{flexDirection:"row"}}>
                                  <View>
                                             <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>Reason : </Text>
                                  </View>
                                  <View>
                                             <Text style={[styles.text, {fontSize:height*0.02}]}>{"Resad"}</Text>
                                  </View>
                            </View>

                     </View>
         
             </View>

         )
     }
     header =()=>{
       return (
         <View style={{flexDirection:"row",marginTop:15}}>
             <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                 <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>#</Text>
             </View>
             <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Report</Text>
             </View>
              <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                  <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Price</Text>
             </View>
             <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                   <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>Actions</Text>
             </View>
         </View>
       )
     }
     footer =()=>{
       return(
         <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
             <View style={{alignSelf:"flex-end",justifyContent:"center",marginRight:20}}>
                 <Text style={[styles.text,{color:"#000"}]}>Total :{this.getTotal()}</Text>
             </View>
             <View style={{marginTop:20}}>
                 <TouchableOpacity style={{height:height*0.04,width:width*0.4,alignItems:"center",justifyContent:"center",backgroundColor:themeColor}}>
                      <Text style={[styles.text,{color:"#fff"}]}>Add Report</Text>
                 </TouchableOpacity>
             </View>
         </View>
       )
     }
     deleteItem = async(item,index)=>{
          let api = `${url}/api/prescription/subreports/${item.id}/`
          let del = await HttpsClient.delete(api)
          if(del.type=="success"){
            let duplicate  =this.state.item
            duplicate.subReports.splice(index,1)
            this.setState({item:duplicate})
            return this.showSimpleMessage("Deleted SuccessFully","green","success")
          }else{
              return this.showSimpleMessage("Try Again","red","danger")
          }
     }
     createAlert = (item,index) => {
    Alert.alert(
      "Do you want to delete?",
      `${item.category}`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.deleteItem(item,index) } }
      ]
    );

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
                <StatusBar backgroundColor={themeColor}/>
                <View style={{ height: height * 0.1, backgroundColor:themeColor,flexDirection:"row"}}>
                     <View style={{flex:0.7}}>
                         <View style={{flex:0.5,justifyContent:"center",marginLeft:20}}>
                            <Text style={[styles.text,{color:"#ffff",fontWeight:'bold',fontSize:height*0.03}]}>{this.state?.item?.diagonistic_clinic?.companyName?.toUpperCase()}</Text>

                         </View>
                         <View style={{flex:0.5,marginLeft:20,}}>
                             <View>
                                   <Text style={[styles.text,{color:"#fff",fontSize:height*0.017}]}>{this.state?.item?.diagonistic_clinic?.address}</Text>
                             </View>
                         
                            <View style={{ }}>
                                <Text style={[styles.text, { color: "#fff" ,fontSize:height*0.017}]}>{this.state?.item?.diagonistic_clinic?.city}-{this.state?.item?.diagonistic_clinic?.pincode}</Text>
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
                   
             
                 <View style={{flex:1}}>
                    <View style={{ flex: 0.13,borderColor:"#eee",borderBottomWidth:0.5,}}>
                        <View style={{flex:0.5,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                             <View style={{flexDirection:'row'}}>
                               <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Name : </Text>
                               </View>
                                <View>
                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{this.state?.item?.user?.profile?.name}</Text>
                                </View>
                           </View>
                               <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Age : </Text>
                                </View>
                                <View>
                                        <Text style={[styles.text, { color: "#000",fontSize:height*0.02 }]}>{this.state?.item?.user?.profile?.age}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={[styles.text,{fontSize:height*0.02}]}>Sex : </Text>
                                </View>
                                <View>
                                    <Text style={[styles.text, { color: "#000",fontSize:height*0.02}]}>{this.state?.item?.user?.profile?.sex}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:0.5,paddingRight:20,flexDirection:"row",justifyContent:"space-around"}}>
                            <View>
                                
                            </View>
                            <Text style={[styles.text,{fontSize:height*0.016}]}>Prescription No : {this.state?.item?.prescription}</Text>
                            <Text style={[styles.text,{textAlign:"right",fontSize:height*0.016}]}>{moment(this.state?.item?.created).format('DD/MM/YYYY')}</Text>
                        </View>
                       
                    </View>
         
                  
                        <View style={{flex:0.8,}}>

                           <FlatList
                             ListFooterComponent={this.footer()} 
                             data={this.state?.item?.subReports}
                             keyExtractor={(item,index)=>index.toString()}
                             ListHeaderComponent={this.header()}
                             renderItem={({item,index})=>{
                                return(
                                       <View style={{flexDirection:"row",marginTop:15}}>
                                          <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                                              <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{index+1}</Text>
                                          </View>
                                          <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.category}</Text>
                                          </View>
                                            <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.price}</Text>
                                          </View>
                                          <View style={{flex:0.3,flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
                                              <TouchableOpacity>
                                                  <Entypo name="edit" size={24} color={themeColor} />
                                              </TouchableOpacity>   
                                                 <TouchableOpacity 
                                                   onPress={()=>{
                                                      Linking.openURL(`${url}${item.report_file}`)
                                                   }}
                                                 
                                                 >
                                                     <Feather name="download" size={24} color={themeColor}/>
                                              </TouchableOpacity>  
                                                <TouchableOpacity 
                                                  onPress={()=>{
                                                    this.createAlert(item)
                                                  }}
                                                >
                                                    <AntDesign name="delete" size={24} color={themeColor} />
                                              </TouchableOpacity>  
                                          </View>
                                      </View>
                                )
                             }}
                           />

                    </View>
         
                    <View style={{ flex: 0.07, backgroundColor:themeColor,flexDirection:'row'}}>
                        <TouchableOpacity style={{ flex: 0.5, flexDirection: "row",alignItems: 'center', justifyContent: "center"}}
                         onPress ={()=>{
                             if (Platform.OS == "android") {
                                 Linking.openURL(`tel:${this.state.appDetails?.mobile}`)
                             } else {

                                 Linking.canOpenURL(`telprompt:${this.state.appDetails?.mobile}`)
                             }
                         }}
                        >
                            <View style={{alignItems:'center',justifyContent:"center"}}>
                                <Feather name="phone" size={height*0.035} color="#fff" />
                            </View>
                            <View style={{alignItems:'center',justifyContent:"center",marginLeft:5}}>
                                    <Text style={[styles.text, { color: "#ffff" }]}>{this.state.item?.diagonistic_clinic?.mobile}</Text>
                            </View>
                        </TouchableOpacity >
                        <View style={{ flex: 0.5, flexDirection: "row"}}>
                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                <Feather name="mail" size={height*0.035} color="#fff" />
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: "center", marginLeft: 5 }}>
                                    <Text style={[styles.text, { color: "#ffff" }]}>{this.state?.item?.diagonistic_clinic?.offical_email}</Text>
                            </View>
                        </View>
                    </View>
                
                 </View>
                </GestureRecognizer>

                
                {
                    this.lottieModal()
                }
           
       
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
        fontSize:height*0.02
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
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, {selectTheme, selectClinic, selectWorkingClinics, selectOwnedClinics, setNoticationRecieved  })(ViewReports);