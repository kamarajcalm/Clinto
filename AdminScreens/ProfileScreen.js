import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign,Feather,Entypo ,FontAwesome} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal:false
        };
    }
    componentDidMount() {

    }
    logOut = async()=>{
        this.setState({showModal:false})
        await  AsyncStorage.clear();
        return this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',

                    },

                ],
            })
        )
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

                            >
                               
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Profile</Text>
                            </View>
                     
                        </View>
                        {/* CHATS */}
                        <View style={{flex:1,backgroundColor:themeColor}}>
                                 <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 ,}}
                        onPress={() => { this.props.navigation.navigate('MedicinesHome')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                              <AntDesign name="medicinebox" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Medicines</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                                <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('DiagnosisCenter')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Diagnosis Center</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                             <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('DiagnosisCategories')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Diagnosis Categories</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('MedicalOwners')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons name="person" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Pharmacy Owners</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                                  <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('LabOwners')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Ionicons name="person" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Diagnosis Center Owners</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                         <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.props.navigation.navigate('PriceVerification')}}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                               <FontAwesome name="money" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Price Verification</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                                     <TouchableOpacity style={{ flexDirection: "row", height: height * 0.05, paddingHorizontal: 20, width, marginTop: 20 }}
                        onPress={() => { this.setState({showModal:true}) }}
                    >
                        <View style={{ flex: 0.8, flexDirection: "row" }}>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Entypo name="log-out" size={24} color="#fff" />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Logout</Text>
                            </View>
                        </View>

                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}>
                            <Entypo name="triangle-right" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                        </View>
                        <View>
                            <Modal
                                animationIn="slideInUp"
                                animationOut="slideOutDown"
                                isVisible={this.state.showModal}
                                onBackdropPress={() => { this.setState({ showModal: false }) }}
                            >
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Do you want to logout?</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                                onPress={() => { this.logOut() }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                                onPress={() => { this.setState({ showModal: false }) }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
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
export default connect(mapStateToProps, { selectTheme })(ProfileScreen);

