import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import moment from 'moment-timezone';
const date = new Date();
const day = date.getDay();

class ViewReceptionProfile extends Component {
    constructor(props) {
        let item = props.route.params.item

        super(props);
        this.state = {
            item,
  
        };
    }


    componentDidMount() {
        console.log(this.state.item)
    }

   
    render() {
    
        const unknown = "https://st2.depositphotos.com/1531183/5770/v/950/depositphotos_57709697-stock-illustration-male-person-silhouette-profile-picture.jpg"


        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1 }}>
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff", fontWeight: "bold", fontSize: 20 }]}>Reception Profile</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                            </View>
                        </View>

                        <ScrollView
                            style={{}}
                      
                        >
                             <View style={{alignItems:"center",justifyContent:"center",marginVertical:20}}>
                                <Image 
                                   resizeMode={"cover"}
                                   style={{height:100,width:100,borderRadius:50}}
                                   source={{ uri: this?.state?.item?.user?.profile?.displayPicture || unknown}}
                                />
                             </View>
                          
                         <View style={{marginTop:10,}}>
                               <View style={{flexDirection:"row",marginLeft:20}}> 
                                   <View style={{alignItems:"center",justifyContent:"center",flex:0.4,flexDirection:"row"}}>
                                       <View style={{flex:0.9,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Name</Text>
                                       </View>
                             
                                        <View style={{ flex: 0.1}}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                      
                                   </View>
                                    <View style={{  flex:0.6}}>
                                        <Text style={[styles.text,{marginTop:3}]}>  {this.state.item.user.first_name}</Text>
                                   </View>
                               
                               </View>
                                <View style={{ flexDirection: "row", marginLeft: 20 ,marginTop:10}}>
                                    <View style={{ alignItems: "center", justifyContent:"center" ,flex:0.4,flexDirection:"row"}}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Age</Text>
                                        </View>
                                    
                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{flex: 0.6}}>
                                      
                                        <Text style={[styles.text, { marginTop: 3 }]}>  {this.state.item.user.profile.age}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center", flex: 0.4, flexDirection: "row", }}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Mobile</Text>
                                        </View>
                                   
                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{flex:0.6}}>
                                        <Text style={[styles.text, , { marginTop: 3 }]}>  {this.state.item.user.profile.mobile}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center", flex: 0.4, flexDirection: "row", }}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Address</Text>
                                        </View>

                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.6 }}>
                                        <Text style={[styles.text, , { marginTop: 3 }]}>  {this.state.item.user.profile.address}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center", flex: 0.4, flexDirection: "row", }}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>City</Text>
                                        </View>

                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.6 }}>
                                        <Text style={[styles.text, , { marginTop: 3 }]}>  {this.state.item.user.profile.city}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center", flex: 0.4, flexDirection: "row", }}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>State</Text>
                                        </View>

                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.6 }}>
                                        <Text style={[styles.text, , { marginTop: 3 }]}>  {this.state.item.user.profile.state}</Text>
                                    </View>

                                </View>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                                    <View style={{ alignItems: "center", justifyContent: "center", flex: 0.4, flexDirection: "row", }}>
                                        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}>Pincode</Text>
                                        </View>

                                        <View style={{ flex: 0.1 }}>
                                            <Text style={[styles.text, { color: '#000', fontSize: 18 }]}> : </Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.6 }}>
                                        <Text style={[styles.text, , { marginTop: 3 }]}>  {this.state.item.user.profile.pincode}</Text>
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

})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        user: state.selectedUser,
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewReceptionProfile);