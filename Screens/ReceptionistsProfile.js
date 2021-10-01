import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView, FlatList } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme, selectClinic } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';

class ReceptionistsProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    changeClinic = () => {

    }
    componentDidMount() {
        console.log(this.props.user.profile.recopinistclinics, "popo")
    }
    render() {
        return (
            <View style={{}}>
                <View style={{ margin: 20 }}>
                    <View>
                        <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>Personal Info</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>Age</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.age}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>Blood Group</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", fontSize:height*0.02}]}>{this.props.user.profile.blood_group}</Text>
                        </View>
                    </View>


                    {/* <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Height</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.height}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Weight</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.weight}</Text>
                        </View>
                    </View> */}
                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>Mobile</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000",fontSize:height*0.02 }]}>{this.props.user.profile.mobile}</Text>
                        </View>
                  
                    </View>
                     <View style={{ flexDirection: "row", marginTop: 15, }}>
                       
                        <View style={{ flex: 1}}>
                            <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>Email</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", fontSize:height*0.02}]}>{this.props.user.email}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderColor: "#F0F0F0", borderTopWidth: 3,borderBottomWidth:3 }}>
                     <View style={{marginLeft:20,flexDirection:"row",}}>
                         <View style={{marginTop:5,flex:0.6}}>
                             <Text style={[styles.text,{fontSize:height*0.02}]}>Working Clinic :</Text>
                         </View>
                   
                     </View>
                      <TouchableOpacity style={{flexDirection:"row",marginVertical:20}}
                       onPress={() => { this.props.navigation.navigate('ViewClinicDetails', {item:this.props.user.profile.recopinistclinics[0],}) }}
                      >
                          <View style={{flex:0.8,paddingLeft:20}}>
                                   <Text style={[styles.text,{fontSize:height*0.02}]}>{this.props.user.profile.recopinistclinics[0].clinicname}</Text>
                          </View>
                          <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                <AntDesign name="rightcircleo" size={height*0.02} color="#000" />   
                          </View>
                      </TouchableOpacity>
                   
                </View>
            </View>

           
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily,
        fontSize: 18
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
        user: state.selectedUser,
        clinic: state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(ReceptionistsProfile)