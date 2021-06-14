import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import HttpsClient from '../api/HttpsClient';
class ReceptionistProfile extends Component {
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
        let dp =null
        if (this.state.item.user.profile.displayPicture){
            dp = this.state.item.user.profile.displayPicture
        }
        return (
            <> 
            <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                <View style={{ flex: 1, }}>
                        {/*Headers  */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}> Profile</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                        {/* Details */}
                     <ScrollView>
                        <View style={{marginTop:10,alignItems:"center",justifyContent:"center"}}>
                           <Image 
                             style={{height:100,width:100,borderRadius:50,backgroundColor:"red",resizeMode:"cover"}}
                             source={{ uri:dp||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}}
                           />
                           <View style={{marginTop:5}}>
                                    <Text style={[styles.text]}>{this.state.item.user.profile.name}</Text>
                           </View>
                        </View>
                            <View style={[styles.boxWithShadow, { height: height * 0.07, width, backgroundColor: "#eee", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 ,marginTop:5}]}>
                                <View>
                                    <Text style={[styles.text]}>Personal Info</Text>
                                </View>
                                <View>
                                    <AntDesign name="down" size={20} color="black" />
                                </View>
                            </View>
                            <View style={{margin:20}}>
                              <View style={{flexDirection:"row"}}>
                                    <View>
                                        <Text style={[styles.text,{color:"#000"}]}>Mobile : </Text>
                                    </View>
                                    <View>
                                        <Text>{this.state.item.user.profile.mobile}</Text>
                                    </View>
                              </View>  
                                <View style={{ flexDirection: "row" ,marginTop:10}}>
                                    <View>
                                        <Text style={[styles.text, { color: "#000" }]}>Address : </Text>
                                    </View>
                                    <View>
                                        <Text>{this.state.item.user.profile.address}</Text>
                                    </View>
                                </View>
                               
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <View>
                                        <Text style={[styles.text, { color: "#000" }]}>city : </Text>
                                    </View>
                                    <View>
                                        <Text>{this.state.item.user.profile.city}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <View>
                                        <Text style={[styles.text, { color: "#000" }]}>state : </Text>
                                    </View>
                                    <View>
                                        <Text>{this.state.item.user.profile.state} - {this.state.item.user.profile.pincode}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginTop: 10 }}>
                                    <View>
                                        <Text style={[styles.text, { color: "#000" }]}>qualification : </Text>
                                    </View>
                                    <View>
                                        <Text>{this.state.item.user.profile.qualification}</Text>
                                    </View>
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
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
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
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(ReceptionistProfile);