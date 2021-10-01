import React, { Component } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View ,StyleSheet,Linking, TextInput ,Keyboard} from 'react-native';
import settings from '../AppSettings';
import Modal from "react-native-modal";
const url = settings.url
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const {height,width} =Dimensions.get('window')
const screenHeight = Dimensions.get("screen").height
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { Feather ,FontAwesome,FontAwesome5,Ionicons} from '@expo/vector-icons';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import CheckBox from '@react-native-community/checkbox';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
import ViewMedicines from '../AdminScreens/ViewMedicines';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';

 const data =[
   {
     medicineName:"Dolomites",
     requiredQuantity:5,
     customerName:"kamaraj",
     age:22,
     sex:"Male",
     Reason:"Fever"
   },
   {
     customerName:"kamaraj",
     medicineName:"Cipla",
     requiredQuantity:5,
     age:22,
     sex:"Male",
     Reason:"Fever"
   },
   {
     customerName:"kamaraj",
     medicineName:"paracetomol",
     requiredQuantity:5,
      age:22,
     sex:"Male",
     Reason:"Fever"
   },
 ]
 class Requests extends Component {
      constructor(props) {
        super(props);
       this.state = {
          availabilityModal:false,
          orderRequestModal:false,
          requests:[],
          refreshing:false,
          selectedItem:null,
          acceptModal:false,
          today:moment(new Date()).format("YYYY-MM-DD"),
          price:"",
          keyBoardHeight:0,
          changedMedicines:[]
        };
    }
  separator=()=>{
    return(
      <View style={{height:0.5,backgroundColor:"gray"}}>

      </View>
    )
  }
  getRequests = async() =>{
   let api = `${url}/api/prescription/vieworders/?date=${this.state.today}&status=Pending`
   let data = await HttpsClient.get(api)
   console.log(api)
   if(data.type == 'success'){
       this.setState({requests:data.data})
   }
  }
  componentDidMount(){
     this.subscribe =  Notifications.addNotificationResponseReceivedListener( async(resposnse)=>{
        await Notifications.dismissAllNotificationsAsync()
          if(resposnse.actionIdentifier=="1"){
            this.setState({availabilityModal:true})
          }
     })
       Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.getRequests()
  }
      componentWillUnmount(){
        this.subscribe.remove()
        Keyboard.removeListener('keyboardDidShow', this._keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this._keyboardDidHide);
    }
            _keyboardDidShow = (e) => {
            console.log()
        this.setState({keyBoardHeight:e.endCoordinates.height})
    };

    _keyboardDidHide = () => {
        this.setState({ keyBoardHeight: 0 })
    };
  header =()=>{
    return(
      <View>
          <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
            <View style={{flexDirection:"row",}}>
               <Text style={[styles.text,{color:"#000"}]}>Name : </Text>
                  <Text style={[styles.text,{color:"#000"}]}>{this.state.selectedItem?.otherDetails?.username}</Text>
            </View>
            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                onPress={() => {
                    if (Platform.OS == "android") {
                        Linking.openURL(`tel:${this.state?.selectedItem?.otherDetails?.mobile}`)
                    } else {

                        Linking.canOpenURL(`telprompt:${this.state?.selectedItem?.otherDetails?.mobile}`)
                    }
                  }}
            >
                <FontAwesome name="phone" size={20} color="#63BCD2"/>
            </TouchableOpacity>
     
          </View>
         <View style={{flexDirection:"row",marginVertical:10}}>
                <View style={{flex:0.2,alignItems:'center',justifyContent:"center"}}>
                      <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>#</Text>
                </View>
                <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                      <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>Medicine</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                      <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>Qty</Text>
                </View>
                <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                     <Text style={[styles.text,{color:"#000",textDecorationLine:"underline"}]}>Price</Text>
                </View>
            </View>
      </View>
    )
  }
  select =(item,index) =>{
       let duplicate = this.state.medicines
       duplicate[index].selected = !duplicate[index].selected
       this.setState({medicines:duplicate})
  }
  // acceptModal =() =>{
  //   return(
  //     <Modal 
  //       onBackdropPress={()=>{this.setState({acceptModal:false})}}
  //       statusBarTranslucent={true}
  //       isVisible={this.state.acceptModal}
  //       deviceHeight={screenHeight}
  //     >
  //         <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
  //             <View style={{height:height*0.4,backgroundColor:"#fff",borderRadius:10,width:width*0.9}}>
  //                   <View style={{alignItems:"center",justifyContent:"center",marginVertical:10}}>
  //                       <Text style={[styles.text,{color:"#000",fontSize:20}]}>Price Confirm</Text>
  //                   </View>
  //              </View>    
  //         </View>  
  //     </Modal>
  //   )
  // }
  footer =() =>{
      return(
        <View style={{marginVertical:20}}>
             <View style={{alignSelf:"flex-end",paddingHorizontal:20}}>
                 <Text style={[styles.text,{color:"#000"}]}>Total : {this.state?.selectedItem?.total_price}</Text>
             </View>
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
    checkChange =(medicine,price)=>{
      let found = this.state.changedMedicines.find((item)=>{
          return item.id ==medicine.id
      })
      if(found){
        let index = this.state.changedMedicines.indexOf(found)
        this.state.changedMedicines[index].price = price
        this.setState({changedMedicines:this.state.changedMedicines})
      }else{
        let pushObj ={
           id:medicine.id,
           price:medicine.price
        } 
        this.state.changedMedicines.push(pushObj)
        this.setState({changedMedicines:this.state.changedMedicines})
      }
     
    }
    changeTotalPrice =()=>{
      const total = this.state?.selectedItem?.medicineDetails.reduce((total,item)=>{
        return total+Number(item.price)
      },0)
      let duplicate = this.state.selectedItem
      duplicate.total_price = total
      this.setState({selectedItem:duplicate})
    }
    changePrice =(price,item,index)=>{
      let duplicate = this.state.selectedItem
      duplicate.medicineDetails[index].price = price
      this.setState({selectedItem:duplicate},()=>{
        this.changeTotalPrice()
        this.checkChange(item,price)
      })
    }
  availablityModal =()=>{
    return(
      <Modal 
        style={{marginBottom:this.state.keyBoardHeight}}
        onBackdropPress={()=>{this.setState({availabilityModal:false})}}
        statusBarTranslucent={true}
        isVisible={this.state.availabilityModal}
        deviceHeight={screenHeight}
      >
          <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
              <View style={{height:height*0.6,backgroundColor:"#fff",borderRadius:10,width:width*0.9}}>
                    <View style={{alignItems:"center",justifyContent:"center",marginVertical:10}}>
                        <Text style={[styles.text,{color:"#000",fontSize:20}]}>Availabilty Check?</Text>
                    </View>
                    <View style={{flex:0.8}}>
                                <FlatList
                                  ListFooterComponent={this.footer()}
                                  ListHeaderComponent ={this.header()}
                                  data={this.state?.selectedItem?.medicineDetails}
                                  keyExtractor={(item,index)=>index.toString()}
                                  renderItem={({item,index})=>{
                                      return(
                                        <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.2,alignItems:'center',justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>{index+1} .</Text>
                                            </View>
                                            <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>{item.medicinetitle}</Text>
                                            </View>
                                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text]}>{item.quantity} </Text>
                                            </View>
                                              <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                   <TextInput
                                                     onChangeText={(price)=>{
                                                       this.changePrice(price,item,index)
                                                     }}
                                                     value={item.price.toString()}
                                                     keyboardType={"numeric"}
                                                     style={{height:35,width:"80%",backgroundColor:"#fafafa",alignItems:"center",justifyContent:"center",paddingLeft:10}}
                                                     selectionColor={themeColor}
                                                   />
                                              </View>
                                        </View>
                                      )
                                  }}
                                />
                    </View>
                    <View style={{flex:0.2,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                         <TouchableOpacity style={{height:height*0.04,alignItems:"center",justifyContent:"center",backgroundColor:"green",width:width*0.23,borderRadius:5}}
                          onPress={()=>{this.acceptOrder()}}
                         >
                              <Text style={[styles.text,{color:"#fff"}]}>Yes</Text>
                         </TouchableOpacity>
                             <TouchableOpacity style={{height:height*0.04,alignItems:"center",justifyContent:"center",backgroundColor:"red",width:width*0.23,borderRadius:5}}
                              onPress={()=>{this.setState({availabilityModal:false})}}
                             >
                              <Text style={[styles.text,{color:"#fff"}]}>No</Text>
                         </TouchableOpacity>
                    </View>
              </View>
          </View>  
      </Modal>
    )
  }
  acceptOrder = async(item) =>{
  
       let api = `${url}/api/prescription/medicalAccept/`
       let sendData ={
         accepted: true,
         order:this.state.selectedItem.id,
         price:this.state.selectedItem.total_price,
         clinic:this.props.medical.clinicpk,
         changedmedicines:this.state.changedMedicines
       }
       let post = await HttpsClient.post(api,sendData)
       console.log(post)
       if(post.type=="success"){
           this.showSimpleMessage(`${post.data.success}`,"green","success")
           return this.setState({availabilityModal:false})
       }else{
          this.showSimpleMessage(`Try Again`,"red","danger")
       }
  }
  rejectOrder = async() =>{

  }
  refresh = () =>{
   this.getRequests();
  }
  getFirstLetter =(item ,patient=null)=>{
          if(patient){
              let name = item.patientname.name.split("")
              return name[0].toUpperCase()
          }
      
          let clinicName = item?.clinicname?.name.split("")

          return clinicName[0].toUpperCase();
      
    
  }
  render() {
    return (
      <View style={{flex:1}}>
          <FlatList
             contentContainerStyle={{paddingBottom:90}}
            refreshing={this.state.refreshing}
            onRefresh ={()=>{this.refresh()}}
            data={this.state.requests}
            keyExtractor={(item,index)=>index.toString()}
            ItemSeparatorComponent={this.separator}
            renderItem ={({item,index})=>{
                   return(
                     <TouchableOpacity style={{minHeight:height*0.1,flexDirection:"row",marginVertical:10}}
                        onPress={()=>{this.props.navigation.navigate("RequestView",{item})}}
                     >
                            <View style={{ flexDirection: "row", flex: 1, }}>
                           
                                    <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                       <LinearGradient
                                            style={{ height: height*0.08, width: height*0.08, borderRadius:height*0.04,alignItems: "center", justifyContent: "center" }}
                                            colors={["#333", themeColor, themeColor]}
                                        >
                                            <View >
                                                <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{"P"}</Text>
                                            </View>
                                        </LinearGradient>
                                    </View>
                                    <View style={{ flex: 0.7, paddingLeft: 10 }}>
                                        <View style={{ marginTop:height*0.01,flex:1,flexDirection:"row"}}>
                                          <View style={{flex:1,flexDirection:"row"}}>
                                            <View>
                                                  <Text style={[styles.text, { color: "#000", fontWeight: "bold", fontSize:height*0.02}]}>{item.otherDetails.username}</Text>
                                            </View>
                                            <View>
                                                 <Text style={[styles.text,{fontSize:height*0.02}]}> ({item.otherDetails.age} - {item.otherDetails.sex}) </Text>
                                            </View>     
                                          </View>
                                         
                  
                                        </View>
                                        <View style={{marginTop:height*0.01,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                          <View>
                                                 <Text style={[styles.text, { color: "#000",  fontSize:height*0.02}]}>Price : ₹{item.total_price}</Text>
                                          </View>
                                          <View style={{paddingRight:10}}>
                                                <Text style={[styles.text, { color: "#000",  fontSize:height*0.02}]}>Items : {item.medicines.length}</Text>
                                          </View> 
                                        </View>
                                                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flex:1,marginTop:height*0.01,paddingRight:20}}>
                                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width:height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center' }]}
                                                    onPress={() => { this.chatClinic(item) }}
                                                >
                                                    <Ionicons name="md-chatbox" size={height*0.02} color="#63BCD2" />
                                                </TouchableOpacity>
                                                                                       <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width: height*0.04, borderRadius:height*0.02, alignItems: "center", justifyContent: 'center', }]}
                            onPress={() => {
                       
                                      if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.clinicname.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.clinicname.mobile}`)
                                    }}}
    
    
                        >
                           <Ionicons name="call" size={height*0.02} color="#63BCD2" />
                        </TouchableOpacity>
                                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height:height*0.04, width:height*0.04, borderRadius: height*0.02, alignItems: "center", justifyContent: 'center' }]}
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
                                                    <FontAwesome5 name="directions" size={height*0.02} color="#63BCD2" />
                                                </TouchableOpacity>
                                            </View>
                                     
                                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop:height*0.02, }}>
                                            <View style={{ flex: 0.7 ,flexDirection:"row"}}>
                                              <TouchableOpacity style={{flex:0.5}} 
                                               onPress={()=>{
                                                 this.setState({selectedItem:item,availabilityModal:true})
                                               }}
                                              
                                              >
                                                           <Text style={[styles.text, { color: "green" }]}>Accept</Text>
                                              </TouchableOpacity>
                                             <TouchableOpacity style={{flex:0.5}}>
                                                      <Text style={[styles.text, { color: "red" }]}>Reject</Text>
                                             </TouchableOpacity>
                                            </View>
                                            <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                     <Text style={[styles.text, { color: "#000", fontSize:height*0.018 }]}>{moment(item.created).format("hh:mm a")}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                        
                     </TouchableOpacity>
                   )
            }}
          />  
          {
            this.availablityModal()
          }
     
      </View>
    )
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
    card: {

        backgroundColor: "#eeee",
        height: height * 0.1,
        marginHorizontal: 10,
        marginVertical: 3

    },
            boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    }
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(Requests);