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
import { selectTheme ,selectClinic} from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { color } from 'react-native-reanimated';

class DoctorProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    changeClinic=()=>{
       
    }
  
    componentDidMount(){
   
        console.log(this.props.user,"popo")
    }
    render() {
        return (
            <View style={{}}
           
            >
                <View style={{ margin: 20}}>
                    <View>
                        <Text style={[styles.text,{color:"gray"}]}>Personal Info</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Age</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.age}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Blood Group</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.blood_group}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 15, alignItems: "center", justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.6 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Height</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.height}</Text>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={[styles.text, { color: "gray" }]}>Weight</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.weight}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                        <View >
                            <Text style={[styles.text, { color: "gray" }]}>Mobile</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.mobile}</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15,}}>
                        <View >
                            <Text style={[styles.text, { color: "gray" }]}>Address</Text>
                            <Text style={[styles.text, { marginTop: 5,color: "#000",  }]}>{this.props.user.profile.address}</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000",  }]}>{this.props.user.profile.city}-{this.props.user.profile.pincode}</Text>
                        </View>
                       
                    </View>
                        
                </View>
                {/* Working Clinics */}
                <View style={{ borderColor: "#F0F0F0", borderTopWidth: 3,borderBottomWidth:3 }}>
                     <View style={{marginHorizontal:20}}>
                         <View style={{marginTop:5}}>
                             <Text style={[styles.text]}>Working Clinics</Text>
                         </View>
                     </View>

                    <FlatList
                        data={this.props.clinics}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            console.log(item)
                            return (
                                <View style={{margin:10 }}>
                                    <TouchableOpacity style={{ flexDirection: "row", minHeight: height * 0.05, borderBottomColor: "#fff", borderBottomWidth: 0.185 }}
                                        onPress={() => { this.props.navigation.navigate('ViewClinicDetails', { item }) }}
                                    >
                                        <View style={{ flex: 0.5, justifyContent: "center" }}>
                                            <Text style={[styles.text, { fontWeight: "bold", color: "#000", marginLeft: 10 }]}>{item.name}</Text>
                                            {this.props.clinic.name == item.name&& <Text style={[styles.text, {  color: "gray", marginLeft: 10 }]}>selected</Text>}
                                        </View>
                                        <View style={{ flex: 0.5, alignItems: 'flex-end', marginRight: 10, justifyContent: "center" }}>
                                            <AntDesign name="rightcircleo" size={24} color="#000" />
                                        </View>

                                    </TouchableOpacity>

                                </View>

                            )
                        }}
                    />
                </View>
                { this.props.ownedClinics.length>0&&     <View style={{ borderColor: "#F0F0F0",  borderBottomWidth: 3 }}>
                    <View style={{ margin: 20 }}>
                        <View>
                            <Text style={[styles.text]}>Owned Clinics</Text>
                        </View>
                    </View>

                    <FlatList
                        data={this.props.ownedClinics}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            console.log(item)
                            return (
                                <View style={{ marginBottom: 10 }}>
                                    <TouchableOpacity style={{ flexDirection: "row", minHeight: height * 0.05, borderBottomColor: "#fff", borderBottomWidth: 0.185 }}
                                        onPress={() => { this.props.navigation.navigate('ViewClinicDetails', { item }) }}
                                    >
                                        <View style={{ flex: 0.5, justifyContent: "center" }}>
                                            <Text style={[styles.text, { fontWeight: "bold", color: "#000", marginLeft: 10 }]}>{item.name}</Text>
                                        </View>
                                        <View style={{ flex: 0.5, alignItems: 'flex-end', marginRight: 10, justifyContent: "center" }}>
                                            <AntDesign name="rightcircleo" size={24} color="#000" />
                                        </View>

                                    </TouchableOpacity>

                                </View>

                            )
                        }}
                    />
                </View>}
                <View style={{margin:20}}>
                      <View>
                          <Text style={[styles.text]}>Patients Attended</Text>
                      </View>
                      <View style={{marginTop:20}}>
                          <Text style={[styles.text,{color:"red"}]}>Overall attended</Text>
                        <Text style={[styles.text, { color: "red" }]}>{this.props.user.totalPatients}</Text>
                      </View>
                    <View style={{ marginTop: 20 ,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                         <View>
                           <Text style={{fontFamily}}>This week</Text>
                           <Text style={[styles.text,{color:"#000",fontWeight:'bold',marginTop:5}]}>10</Text>
                         </View>
                         <View>
                            <Text style={{ fontFamily }}>This Month</Text>
                            <Text style={[styles.text, { color: "#000", fontWeight: 'bold' ,marginTop:5}]}>100</Text>
                         </View>
                         <View>
                            <Text style={{ fontFamily }}>This year</Text>
                            <Text style={[styles.text, { color: "#000", fontWeight: 'bold' ,marginTop:5}]}>1000</Text>
                         </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily,
        fontSize:18
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
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
    }
}
export default connect(mapStateToProps, { selectTheme, selectClinic })(DoctorProfile)