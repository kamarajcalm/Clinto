import React, { Component } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View ,StyleSheet, } from 'react-native';
import settings from '../AppSettings';
import Modal from "react-native-modal";
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const {height,width} =Dimensions.get('window')
const screenHeight = Dimensions.get("screen").height
import { Feather ,FontAwesome,FontAwesome5} from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
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
export default class Requests extends Component {
      constructor(props) {
        super(props);
       this.state = {
         availabilityModal:false,
         orderRequestModal:false,
         medicines:[
           {
             name:"Paracetomol",
             qty:2,
             selected:false
           },
           {
             name:"Dolomites",
             qty:4,
            selected:false
           },
         ]
        };
    }
  separator=()=>{
    return(
      <View style={{height:0.5,backgroundColor:"gray"}}>

      </View>
    )
  }
  header =()=>{
    return(
      <View>
          <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
            <View style={{flexDirection:"row",}}>
               <Text style={[styles.text,{color:"#000"}]}>Name : </Text>
                  <Text style={[styles.text,{color:"#000"}]}>kamaraj</Text>
            </View>
            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                onPress={() => {
                    if (Platform.OS == "android") {
                        Linking.openURL(`tel:${this.state?.clinicDetails?.mobile}`)
                    } else {

                        Linking.canOpenURL(`telprompt:${this.state?.clinicDetails?.mobile}`)
                    }
                  }}
            >
                <FontAwesome name="phone" size={20} color="#63BCD2" />
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
  availablityModal =()=>{
    return(
      <Modal 
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
                                  ListHeaderComponent ={this.header()}
                                  data={this.state.medicines}
                                  keyExtractor={(item,index)=>index.toString()}
                                  renderItem={({item,index})=>{
                                      return(
                                        <View style={{flexDirection:"row",marginTop:10}}>
                                            <View style={{flex:0.2,alignItems:'center',justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>{index+1} .</Text>
                                            </View>
                                            <View style={{flex:0.4,alignItems:"center",justifyContent:"center"}}>
                                                  <Text style={[styles.text]}>{item.name}</Text>
                                            </View>
                                            <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                 <Text style={[styles.text]}>{item.qty}</Text>
                                            </View>
                                              <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                                    <CheckBox
                                                      
                                                      value={item.selected}
                                                      onValueChange={()=>{this.select(item,index)}}
                                                    />
                                              </View>
                                        </View>
                                      )
                                  }}
                                />
                    </View>
                    <View style={{flex:0.2,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}>
                         <TouchableOpacity style={{height:height*0.04,alignItems:"center",justifyContent:"center",backgroundColor:"green",width:width*0.23,borderRadius:5}}
                          onPress={()=>{this.setState({availabilityModal:false})}}
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
  render() {
    return (
      <View>
          <FlatList
            data={data}
            keyExtractor={(item,index)=>index.toString()}
            ItemSeparatorComponent={this.separator}
            renderItem ={({item,index})=>{
                   return(
                     <View style={{height:height*0.1,backgroundColor:"#fafafa",flexDirection:"row",marginVertical:10}}>
                          <View style={{flex:0.6,}}>
                            <View style={{flexDirection:"row",marginHorizontal:15}}>
                              <View style={{height: 30, alignItems:"center",justifyContent:"center"}}>
                                   <Text style={[styles.text,{color:"#000"}]}>{index+1} .</Text>
                              </View>
                                <View style={{marginLeft:10,height:30,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontWeight:"bold"}]}>{item.customerName}</Text>
                                </View>
                                <View style={{marginLeft:10,height:30,alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text]}>({item.age}-{item.sex})</Text>
                                </View>
                                <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                                        onPress={() => {
                                            if (Platform.OS == "android") {
                                                Linking.openURL(`tel:${this.state?.clinicDetails?.mobile}`)
                                            } else {

                                                Linking.canOpenURL(`telprompt:${this.state?.clinicDetails?.mobile}`)
                                            }
                                          }}
                                    >
                                        <FontAwesome name="phone" size={20} color="#63BCD2" />
                             </TouchableOpacity>
                                {/* <View>
                                      <Text style={[styles.text,{color:"#000"}]}>{item.medicineName} :{item.requiredQuantity}</Text>
                                </View> */}
                            </View>
                              <View style={{marginLeft:30}}>
                                    <Text style={[styles.text,{color:"#000"}]}>Reason : {item.Reason}</Text>
                              </View>
                               
                          </View>

                          <View style={{flex:0.4,alignItems:"center",justifyContent:"space-around",}}>
                                  <View>
                                      <TouchableOpacity style={{}}>
                                            <Text style={[styles.text,{color:"green",textDecorationLine:"underline"}]}>Accept</Text>
                                      </TouchableOpacity>
                                  </View>
                                  <View>
                              <TouchableOpacity style={{}}>
                                            <Text style={[styles.text,{color:"red",textDecorationLine:"underline"}]}>Reject</Text>
                                      </TouchableOpacity>
                                  </View>
                          </View>
                     </View>
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