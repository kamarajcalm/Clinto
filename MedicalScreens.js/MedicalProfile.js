import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage, ScrollView, ImageBackground} from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme,selectUser,selectMedical,setShowLottie } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign, Entypo, MaterialCommunityIcons,FontAwesome} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import HttpsClient from '../api/HttpsClient';
import { color } from 'react-native-reanimated';
const {url} =settings
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height
class MedicalProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            medicals:[],
            
        };
    }

    getClinics = async()=>{
        let api = `${url}/api/prescription/getDoctorClinics/?medicalRep=${this.props.user.id}`
        let data = await HttpsClient.get(api)
       console.log(api)
        if (data.type == "success") {
            this.setState({ medicals: data.data.ownedclinics })
        }
      
    }
    componentDidMount() {
       if(this.props.user.profile.occupation =="MediacalRep"){
           this.getClinics()
       }
    }
    logOut = async () => {
        this.setState({ showModal: false })
        await AsyncStorage.clear();
        this.props.selectMedical({})
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
    setActiveMedical = (item) => {
        this.props.selectMedical(item)
        this.setState({ showModal2: false })
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <ScrollView
                         contentContainerStyle={{paddingBottom:90}}
                        >

                      
                        <StatusBar backgroundColor={themeColor} />
                        <ImageBackground
                            blurRadius={1}
                            style={{ height: height * 0.3, alignItems: "center", }}
                            source={require('../assets/Doctor.png')}

                        >
                            {/* headers */}
                            <View style={{ alignSelf: "flex-end", marginRight: 10, marginTop: 10 }}>
                                <TouchableOpacity style={{ marginLeft: 20, alignItems: "center", justifyContent: 'center', flexDirection: "row" }}
                                    onPress={() => { this.setState({ showModal: true }) }}
                                >

                                    <MaterialCommunityIcons name="logout" size={30} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>

                                <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", marginLeft: 20 }}>
                                    <Image
                                        source={{ uri: this.props.user.profile.displayPicture || "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                        style={{ height: 100, width: 100, borderRadius: 50 }}
                                    />
                                    <TouchableOpacity style={{}}
                                        onPress={() => { this.props.navigation.navigate('ProfileEdit') }}
                                    >
                                        <Entypo name="edit" size={20} color={themeColor} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "#000" }]}>{this.props.user.first_name}</Text>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: "center", }}>
                                    <Text style={[styles.text, { fontWeight: "bold", fontSize: 18, color: "gray" }]}>{this.props.user.profile.specialization}</Text>
                                </View>
                            </View>

                        </ImageBackground>
                        <View style={{ marginHorizontal: 20, elevation: 5, backgroundColor: "#fafafa", borderRadius: 15 }}>
                            <View style={{ borderWidth: 2, alignSelf: 'center', borderColor: "gray", width: width * 0.3, marginVertical: 10, borderRadius: 10 }}>

                            </View>
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
                                        <View >
                                            <Text style={[styles.text, { color: "gray" }]}>Mobile</Text>
                                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.mobile}</Text>
                                        </View>

                                    </View>
                                        <View style={{ flexDirection: "row", marginTop: 15, }}>
                                            <View >
                                                <Text style={[styles.text, { color: "gray" }]}>Email</Text>
                                                <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.email}</Text>
                                            </View>

                                        </View>
                                    <View style={{ flexDirection: "row", marginTop: 15, }}>
                                        <View >
                                            <Text style={[styles.text, { color: "gray" }]}>Address</Text>
                                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.address}</Text>
                                            <Text style={[styles.text, { marginTop: 5, color: "#000", }]}>{this.props.user.profile.city}-{this.props.user.profile.pincode}</Text>
                                        </View>

                                    </View>
                             {this.props.user.profile.occupation=="MediacalRep"&&<View style={{ borderColor: "#F0F0F0", borderTopWidth: 3, borderBottomWidth: 3 ,marginTop:10}}>
                                        <View style={{ marginLeft: 20, flexDirection: "row", }}>
                                            <View style={{ marginTop: 5, flex: 0.6 }}>
                                                <Text style={[styles.text,{color:"#000",fontSize:20,textDecorationLine:"underline"}]}>Medicals :</Text>
                                            </View>
                                             <TouchableOpacity 
                                                onPress={()=>{this.setState({showModal2:true})}}
                                               style={{height:height*0.04,flex:0.4,backgroundColor:themeColor,alignItems:"center",justifyContent:"center",borderRadius:10,marginTop:6}}
                                             >
                                                 <Text style={[styles.text,{color:"#fff",fontSize:height*0.015}]}>Change Medical</Text>
                                             </TouchableOpacity>
                                        </View>

                                        <FlatList
                                            showsVerticalScrollIndicator= {false}
                                            data={this.state.medicals}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View style={{ margin: 10 }}>
                                                        <TouchableOpacity style={{ flexDirection: "row", minHeight: height * 0.05, borderBottomColor: "#fff", borderBottomWidth: 0.185 }}
                                                            onPress={() => { this.props.navigation.navigate('ViewMedicalDetails', { item }) }}
                                                        >
                                                            <View style={{ flex: 0.5, justifyContent: "center" }}>
                                                                <Text style={[styles.text, { fontWeight: "bold", color: "#000", marginLeft: 10 }]}>{item.name}</Text>
                                                                {this.props.medical.name == item.name && <Text style={[styles.text, { color: "gray", marginLeft: 10 }]}>selected</Text>}
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
                                    
                                    
                                    }
                                </View>
                         


                            </View>
                        </View>
                        


                        <View>
                            <Modal
                                statusBarTranslucent={true}
                                deviceHeight={screenHeight}
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
                        </ScrollView>
                    </View>
                    <Modal
                        statusBarTranslucent={true}
                        deviceHeight={screenHeight}
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        isVisible={this.state.showModal2}
                        onBackdropPress={() => { this.setState({ showModal2: false }) }}
                    >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                            <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={[styles.text, { color: "#000", fontSize: 18 }]}>Select Clinic</Text>
                                </View>
                                <FlatList
                                     showsVerticalScrollIndicator ={false}
                                    data={this.state.medicals}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 20, alignItems: 'center', justifyContent: "space-around", width }}
                                                onPress={() => { this.setActiveMedical(item) }}
                                            >
                                                <View style={{ flex: 0.6, alignItems: "center", justifyContent: 'center' }}>
                                                    <Text style={[styles.text]}>{item.name}</Text>
                                                </View>

                                                <View style={{ flex: 0.4, alignItems: 'center', justifyContent: "center" }}>
                                                    <FontAwesome name="dot-circle-o" size={24} color={this.props.medical.name == item.name? themeColor : "gray"} />

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />

                            </View>
                        </View>
                    </Modal>
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
        user:state.selectedUser,
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme, selectUser, selectMedical, setShowLottie  })(MedicalProfile);

