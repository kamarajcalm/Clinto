import { LinearGradient } from 'expo-linear-gradient'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View ,StyleSheet, Dimensions,Linking} from 'react-native'
const {height,width} = Dimensions.get("window")
import settings from '../AppSettings'
const{ themeColor,fontFamily} = settings
import {Swipeable}from 'react-native-gesture-handler'
import { Ionicons, Entypo, Feather, MaterialCommunityIcons, FontAwesome, FontAwesome5, EvilIcons,Fontisto,AntDesign,} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme,selectClinic } from '../actions'
import HttpsClient from '../api/HttpsClient'
import moment  from 'moment'
const {url} =settings
 class Reports extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
  }

        getFirstLetter =(item ,clinic=null)=>{
   
        let clinicName = item?.diagonistic_clinic?.companyName?.split("")
    if(clinicName){
             return clinicName[0]?.toUpperCase()||"";
    }
           

    }
      getIndex = (index) => {
        let value = this.props.count - index
        return value
    }
        chatClinic = async (item) => {


        let api = `${url}/api/prescription/createClinicChat/?clinic=${item.diagonistic_clinic.id}&customer=${this.props.user.id}`

        let data = await HttpsClient.get(api)
        console.log(data)

        if (data.type == "success") {
            this.props.navigation.navigate('Chat', { item: data.data })
        }else{
            this.showSimpleMessage("try again ","orange","info")
        }
    }
  render() {
    const {item,index} = this.props
     return (
      <View>
      
                <TouchableOpacity style={[styles.card2, { flexDirection: "row", minHeight: height * 0.15,}]}
                    
                    onPress={() => { this.props.navigation.navigate('ViewReports',{item})}}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <LinearGradient
                              style={{height: 70, width: 70, borderRadius: 35,alignItems: "center", justifyContent: "center" }}
                              colors={["#333", themeColor, themeColor]}
                        >
                              <View >
                                  <Text style={[styles.text, { color: "#ffff", fontWeight: "bold", fontSize: 22 }]}>{this.getFirstLetter(item,item.diagonistic_clinic)}</Text>
                              </View>
                        </LinearGradient>
                       
                    </View>
                    <View style={{ flex: 0.7, marginHorizontal: 10, justifyContent: 'center',}}>
                        <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" ,}}>
                            <View style={{  }}>
                                 <View style={{flexDirection:"row",flex:1,width:"100%"}}>
                                      <Text style={[styles.text, { color: "#000", fontSize:height*0.02 }]} numberOfLines={1}>{item?.diagonistic_clinic?.companyName}</Text>
                                      
                                 </View>
                                  
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text>#{this.getIndex(index)}</Text>
                            </View>
                        </View>
                   <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",justifyContent:"space-around",marginTop:10}}>
                                        {
                                item?.subReports?.map((itemm,index)=>{
                                            return(
                                        <View>
                                            <Text style={[styles.text]}>{index+1}. {itemm.category}</Text> 
                                           
                                        </View>
                                    ) 
                                })
                            }
                            </View>
                                <View style={{ flexDirection: "row", marginVertical:10 }}>
                        <View style={{flexDirection:"row",flex:0.5,alignItems:"center",justifyContent:"space-around"}}>
                                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => { this.chatClinic(item) }}
                        >
                            <Ionicons name="chatbox" size={24} color="#63BCD2" />

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                       
                                      if (Platform.OS == "android") {
                                        Linking.openURL(`tel:${item?.diagonistic_clinic.mobile}`)
                                    } else {

                                        Linking.canOpenURL(`telprompt:${item?.diagonistic_clinic.mobile}`)
                                    }}}
    
    
                        >
                           <Ionicons name="call" size={24} color="#63BCD2" />
                        </TouchableOpacity>
                            <TouchableOpacity style={[styles.boxWithShadow, { backgroundColor: "#fff", height: 30, width: 30, borderRadius: 15, alignItems: "center", justifyContent: 'center', marginLeft: 10 }]}
                            onPress={() => {
                                    
                                          Linking.openURL(
                                                    `https://www.google.com/maps/dir/?api=1&destination=` +
                                                    item.diagonistic_clinic.lat +
                                                    `,` +
                                                    item.diagonistic_clinic.long +
                                                    `&travelmode=driving`
                                                );


                                 }}
    
                        >
                           <FontAwesome5 name="directions" size={24}  color="#63BCD2" />
                        </TouchableOpacity>
                        </View>
                     <View style={{alignItems:"center",justifyContent:"center",flex:0.5}}>
                            <View style={{}}>
                                <Text style={[styles.text,{fontSize:height*0.017}]}>{moment(item.created).format("h:mm A")}</Text>

                            </View>
                            <View style={{}}>
                                <Text style={[styles.text,{fontSize:height*0.017}]}>{moment(item.created).format('DD/MM/YYYY')}</Text>
                            </View>
                         </View>
                 
                         
                    </View>
                    </View>

                </TouchableOpacity>
           
      </View>
    )
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
        marginVertical: 3,
        paddingVertical:10
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
export default connect(mapStateToProps, { selectTheme, selectClinic })(Reports)