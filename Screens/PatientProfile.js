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

class PatientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    changeClinic = () => {

    }
    componentDidMount() {
        console.log(this.props.user, "popo")
    }
    render() {
        return (
            <View style={{}}>
                <View style={{ margin: 20 }}>
                    <View>
                        <Text style={[styles.text, { color: "gray" }]}>Personal Info</Text>
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
                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                        <View >
                            <Text style={[styles.text, { color: "gray" }]}>Address</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.address}</Text>
                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.city}-{this.props.user.profile.pincode}</Text>
                        </View>

                    </View>

                </View>


                <View style={{ borderColor: "#F0F0F0", borderTopWidth: 3, }}>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={{ marginTop: 5 }}>
                            <Text style={[styles.text]}>Health Issues</Text>
                        </View>
                        <View style={{marginTop:5}}>
                            {
                                this.props.user.profile.health_issues.map((item,index)=>{
                                    return(
                                   
                                        <Text style={[styles.text,{color:'#000',marginLeft:5}]} key={index}>{item}</Text>
                                    )   
                                })
                            }
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
export default connect(mapStateToProps, { selectTheme, selectClinic })(PatientProfile)