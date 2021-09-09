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
    AsyncStorage,
    Alert

} from "react-native";
import { Ionicons, Entypo, AntDesign,Fontisto ,FontAwesome} from '@expo/vector-icons';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { selectTheme } from '../../actions';
import settings from '../../AppSettings';
const { diffClamp } = Animated;
const initialLayout = { width: Dimensions.get('window').width };
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;

import axios from 'axios';
import moment from 'moment';
import PendingAppoinments from './PendingAppoinments';
import InProgressAppoinment from './InProgressAppoinment';
import AllAppointments from './AllAppointments';
import DateTimePickerModal from "react-native-modal-datetime-picker";

class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        };
    }
    componentDidMount() {
       console.log(this.props.user)
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
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                                     <Ionicons name="chevron-back-circle" size={30} color="#fff" /> 
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Profile</Text>
                            </View>
                     
                        </View>
                          <ScrollView>
                              <View style={{marginVertical:20,alignItems:"center",justifyContent:"center"}}>
                                    <Image
                                     source={{uri:this.props.user.profile.displayPicture|| "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }} 
                                    style={{borderRadius:45,height:90,width:90}}

                                    />
                                    <TouchableOpacity style={{position:"absolute",top:30,right:width*0.33}}
                                     onPress={()=>{ this.props.navigation.navigate('ProfileEdit')}}
                                    >
                                            <Entypo name="edit" size={24} color={themeColor}/>  
                                    </TouchableOpacity>
                              </View>
                              <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>Name</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.name}</Text>
                                      </View>
                              </View>
                              <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>Mobile</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.mobile}</Text>
                                      </View>
                              </View>
                                     <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>Age</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.age}</Text>
                                      </View>
                              </View>
                                           <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>Address</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.address}</Text>
                                      </View>
                              </View>
                                                   <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>State</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.state}</Text>
                                      </View>
                              </View>
                                                              <View style={{flexDirection:"row",marginTop:15}}>
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                         <Text style={[styles.text]}>Pincode</Text>
                                      </View>
                                      <View style={{flex:0.2,alignItems:"center",justifyContent:"center"}}>
                                          <Text style={[styles.text,{color:"#000"}]}> : </Text>
                                      </View> 
                                      <View style={{flex:0.4,paddingLeft:20}}>
                                           <Text style={[styles.text]}>{this.props.user.profile.pincode}</Text>
                                      </View>
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
        user :state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewProfile);