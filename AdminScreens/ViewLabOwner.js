import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage, ScrollView} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;

class ViewLabOwner extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
            item
        };
    }
    componentDidMount() {
    
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>{this.state?.item?.name}</Text>
                            </View>
                             <View style={{flex:0.2}}>

                             </View>


                        </View>
                  
                           {/* DETAILS */}
               

                         <ScrollView>
                             <View>
                                 <Image 
                                   style={{height:height*0.2,width:width,resizeMode:"cover"}}
                                    source={{ uri: this.state.item.displayPicture}}
                                 />
                             </View>

                               {/* INFO */}

                             <View style={{flexDirection:"row",marginTop:10,marginLeft:10}}>
                                  <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text,{color:"#000",fontSize:22}]}>Name : </Text>
                                  </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text,{fontSize:22}]}>{this.state.item.name}</Text>
                                </View>
                              </View>  
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Age : </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.age}</Text>
                                </View>
                            </View>
                            {/* <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Qualification : </Text>
                                </View>
                             
                                    {
                                        this.state.item.qualifications.map((item,index)=>{
                                                return(
                                                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                                                        <Text style={[styles.text, { fontSize: 22 }]}>{item},</Text>
                                                    </View>
                                              
                                                )
                                        })
                                    }
                        
                            </View> */}
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Specialization : </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.specialization}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Mobile : </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.mobile}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Email : </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.user.email}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Address: </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.address}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>City: </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.city}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>State: </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.state}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 22 }]}>Pincode: </Text>
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[styles.text, { fontSize: 22 }]}>{this.state.item.pincode}</Text>
                                </View>
                            </View>

                            {/* <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                <Text style={[styles.text,{color:"#000",fontSize:22,textDecorationLine:"underline"}]}>Working Clinics:</Text>
                            </View>
                            {
                                this.state.item.workingclinics.map((item,index)=>{
                                    return(
                                        <View style={{marginLeft:20}}>
                                            <Text style={[styles.text,{color:"#000"}]}>{index + 1} . {item.clinicname}</Text>
                                        </View>
                                    )
                                })
                            } */}
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

    }
}
export default connect(mapStateToProps, { selectTheme })(ViewLabOwner);
