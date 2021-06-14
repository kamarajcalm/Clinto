import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
import axios from 'axios';
import moment from 'moment'
const url = settings.url;

class ListPatientPriscription extends Component {
    constructor(props) {
        let item =props.route.params.item
        super(props);
        this.state = {
            item,
            prescriptions:[],
            loading:true
        };
    }
    getPrescription =async()=>{
  
        let api = `${url}/api/prescription/prescriptions/?forUser=${this.state.item.user.id}`
        let data = await HttpsClient.get(api)
     console.log(api,"ppp")
        if (data.type == "success") {
            this.setState({ prescriptions:data.data,loading:false})
        }
    }
    showDifferentPriscription = (item, index) => {

        if (this.props.user.profile.occupation == "Doctor") {

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    // onPress={() => { props.navigation.navigate('showCard', { item }) }}
                    onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{ flex: 0.7 }}>
                        <View style={{ justifyContent: "space-around", flex: 1 }}>
                            <Text style={[styles.text, { fontSize: 18, }]}>{item?.username}</Text>
                            <Text style={[styles.text, { fontSize: 12, fontWeight: "bold" }]}>Reason:</Text>
                            <Text style={[styles.text, { fontSize: 12, }]}>{item.ongoing_treatment}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{moment(item.created).format("DD/MM/YYYY")}</Text>

                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{moment(item.created).format("h:mm a")}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            )
        }
        if (this.props.user.profile.occupation == "ClinicRecoptionist") {

            let dp = null
            if (item?.doctordetails?.dp) {
                dp = `${url}${item?.doctordetails?.dp}`
            }

            return (
                <TouchableOpacity style={[styles.card, { flexDirection: "row", borderRadius: 5 }]}
                    onPress={() => { this.props.navigation.navigate('PrescriptionView', { item, }) }}
                >
                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: "center" }}>
                        <Image
                            source={{ uri: dp || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                            style={{ height: 60, width: 60, borderRadius: 30 }}
                        />
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                        <View >
                            <Text style={[styles.text, { fontSize: 18, }]}>{item?.username.name}</Text>
                            <Text style={[styles.text, { fontSize: 12, }]}>{item?.doctordetails?.name}</Text>

                        </View>

                    </View>
                    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: "center" }}>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{moment(item.created).format("DD/MM/YYYY")}</Text>

                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{moment(item.created).format("h:mm a")}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            )
        }
    }
componentDidMount (){
    this.getPrescription()
}
    render() {
        let dp =''
        if (this.state.item.displayPicture){
            dp = this.state.item.displayPicture
        }
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <StatusBar backgroundColor={themeColor} barStyle={"default"} />
                    {/* HEADERS */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, flexDirection: "row" }}>

                            <Image
                                source={{uri: dp||"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                style={{ height: 60, width: 60, borderRadius: 30, }}

                            />

                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', marginLeft: 20, fontWeight: 'bold', fontSize: 20 }]}>{this.state.item.name}</Text>

                            </View>
                        </View>

                    </View>
                    {
                        this.state.loading ? <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                            <ActivityIndicator color={themeColor} size="large" />
                        </View> : <FlatList 
                         contentContainerStyle ={{paddingBottom:90}}
                         data ={this.state.prescriptions}
                         keyExtractor ={(item,index)=>{index.toString()}}
                         renderItem ={({item,index})=>{
                             return(
                                 <View>
                                     {
                                         this.showDifferentPriscription(item, index)
                                     }
                                 </View>
                             )
                      
                         }}
                        />
                    }

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

        backgroundColor: "#eeee",
        height: height * 0.1,
        marginHorizontal: 10,
        marginVertical: 3

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
        theme: state.selectedTheme,
        user: state.selectedUser,
        clinic: state.selectedClinic,
        ownedClinics: state.selectedOwnedClinics,
        workingClinics: state.selectedWorkingClinics,
    }
}
export default connect(mapStateToProps, { selectTheme })(ListPatientPriscription);