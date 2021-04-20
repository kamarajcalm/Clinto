import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, ScrollView} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons } from '@expo/vector-icons';
import authAxios from '../api/authAxios';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import { Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
class ClinicDetails extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
            item
        };
    }
    componentDidMount() {
        console.log(this.props.route.params.item)
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
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state.item.companyName}</Text>
                            </View>
                            <TouchableOpacity style={{ flex: 0.2 }}
                                
                            >
                        
                            </TouchableOpacity>
                        </View>

                       <ScrollView style={{flex:1,}}>
                                {/* image */}
                           <View style={{height:height*0.2,width}}>
                                <Image 
                                  style={{height:"100%",width:"100%",resizeMode:"cover",borderRadius:5}}
                                    source={{ uri:"https://t2conline.com/wp-content/uploads/2019/04/thumbnail_Minor_Injury_Walk_In_Clinic1.jpg"}}
                                />
                           </View>
                            
                              {/* Details */}
                              <View style={{flexDirection:"row",marginHorizontal:20,marginTop:10}}>
                                  <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{fontWeight:"bold",fontSize:18}]}>Owned By:</Text>
                                  </View>
                                <View style={{alignItems:'center',justifyContent:"center"}}>
                                    <Text style={[styles.text,{marginLeft:10}]}>{this.state?.item?.owner.first_name}</Text>
                                </View>
                              </View>
                            <View style={{ marginHorizontal:20,marginTop:10 }}>
                                <View style={{ }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Address:</Text>
                                </View>
                                <View style={{  marginTop:10}}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.address}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.city}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.state}</Text>
                                    <Text style={[styles.text, { marginLeft: 10 ,fontWeight:"bold"}]}>{this.state?.item?.pincode}</Text>
                                </View>
                             
                            </View>
                            <View style={{ marginHorizontal: 20, marginTop: 10 ,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                    <View style={{justifyContent:"center",alignItems:"center"}}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>OpeningTime:</Text>

                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: "center" ,marginTop:3,marginLeft:5}}>
                                        <Text>{this.state?.item?.startingtime}</Text>
                                    </View>
                                    
                                </View>
                                <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>ClosingTime:</Text>

                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 3, marginLeft: 5}}>
                                        <Text>{this.state?.item?.closingtime}</Text>
                                    </View>
                                    
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Mobile:</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.mobile}</Text>
                                </View>
                                <TouchableOpacity style={{marginLeft:5,alignItems:"center",justifyContent:"center"}}
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.mobile}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.mobile}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Emergency Contact 1</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.firstEmergencyContactNo}</Text>
                                </View>
                                <TouchableOpacity style={{ marginLeft: 5 }} 
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.firstEmergencyContactNo}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.firstEmergencyContactNo}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18 }]}>Emergency Contact 2</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state?.item?.secondEmergencyContactNo}</Text>
                                </View>
                                <TouchableOpacity style={{ marginLeft: 5 }} 
                                    onPress={() => {
                                        if (Platform.OS == "android") {
                                            Linking.openURL(`tel:${this.state?.item?.secondEmergencyContactNo}`)
                                        } else {

                                            Linking.canOpenURL(`telprompt:${this.state?.item?.secondEmergencyContactNo}`)
                                        }
                                    }}
                                >
                                    <Feather name="phone" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", alignItems:'center',justifyContent:"center",marginTop:20}}>
                                <TouchableOpacity style={{height:height*0.05,width:width*0.4,backgroundColor:themeColor,borderRadius:5,alignItems:'center',justifyContent:"center"}}
                                    onPress={() => { this.props.navigation.navigate("CreateReceptionist")}}
                                >
                                    <Text style={[styles.text,{color:"#fff"}]}>Create Receptionist</Text>
                                </TouchableOpacity>
                            </View>
                           
                       </ScrollView>
                        
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
        user: state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(ClinicDetails);
