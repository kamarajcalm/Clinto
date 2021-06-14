import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import * as  ImagePicker from 'expo-image-picker';
import { TextInput } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
class CreateDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            openImageModal: false,
            latitude:"",
            longitude:'',
            Name:"kamaraj",
            PhoneNO:"7010117137",
            Age:"22",
            Specialization:"heart surgeon",
            Experience:"10",
            NoOfClinics:"2",
            Location:"bengaluru",
            clinicName:"Sri Devi Clinic",
            openingTime:null,
            closingTime:null,
            mode: 'time',
            date: new Date(),
            show1: false,
            show2: false,
        };
    }
   
    logOut = () => {
        this.setState({ showModal: false })
        AsyncStorage.removeItem('login')
        return this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login2',

                    },

                ],
            })
        )
    }
    onChange1 = (selectedDate) => {
        if (selectedDate.type == "set") {
            this.setState({ openingTime: moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a'), show1: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {
                console.log(this.state.openingTime, "jjjj")

            })

        } else {
            return null
        }

    }
    onChange2 = (selectedDate) => {
        if (selectedDate.type == "set") {
            this.setState({ closingTime: moment(new Date(selectedDate.nativeEvent.timestamp)).format('h:mm a'), show2: false, date: new Date(selectedDate.nativeEvent.timestamp) }, () => {
                console.log(this.state.closingTime, "jjjj")

            })

        } else {
            return null
        }

    }
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        });
        if (result.cancelled == true) {
            return
        }
        let filename = result.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        var type = match ? `image/${match[1]}` : `image`;
        const photo = {
            uri: result.uri,
            type: type,
            name: filename,
        };
        this.setState({ openImageModal: false })
        this.setState({ image: photo, changedImage: true })
    };
    modalAttach = async (event) => {
        if (event == 'gallery') return this._pickImage();
        if (event == 'camera') {
            this.handlePhoto()
        }
    }
    handlePhoto = async () => {
        let picture = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.1,
        });
        if (picture.cancelled == true) {
            return
        }

        let filename = picture.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        const photo = {
            uri: picture.uri,
            type: type,
            name: filename,
        };
        this.setState({ openImageModal: false })
        this.setState({ image: photo, changedImage: true })
    }
    getLocation = async () => {
        let { status } = await Location.requestPermissionsAsync()
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        console.log(location,"jjjj")
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })
    }
    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.openImageModal}
                hasBackdrop={true}
                style={[styles.modalView1, { position: 'absolute', bottom: -20, left: 0, }]}
                onBackdropPress={() => { this.setState({ openImageModal: false }); }} useNativeDriver={true} onRequestClose={() => { this.setState({ openImageModal: false }); }} >
                <View style={{ paddingVertical: width * 0.01, }}>
                    <View style={{
                        flexDirection: 'row', height: width * 0.25, justifyContent: 'space-between',
                        borderWidth: 0, backgroundColor: 'transparent', borderRadius: 0, paddingTop: width * 0.05
                    }}>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingHorizontal: 4,
                                paddingVertical: 6, borderWidth: 0, borderRadius: 0
                            }}
                            onPress={() => { this.modalAttach('gallery') }}>
                            <FontAwesome
                                name="folder"
                                size={width * 0.16}
                                style={{
                                    marginRight: 5, color: themeColor,
                                    textAlign: 'center', marginLeft: width * 0.1
                                }} />
                            <Text style={{ fontSize: 16, color: themeColor, textAlign: 'center', marginLeft: width * 0.1 }}>Gallary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingHorizontal: 4, paddingVertical: 6, borderWidth: 0, borderRadius: 0, }}
                            onPress={() => { this.modalAttach('camera') }}>
                            <FontAwesome name="camera" size={width * 0.14} style={{ marginRight: 5, color: themeColor, textAlign: 'center', marginRight: width * 0.1 }} />
                            <Text style={{ fontSize: 16, color: themeColor, textAlign: 'center', marginRight: width * 0.1 }}>camera</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    componentDidMount() {
        this.getLocation()
    }
    render() {
        console.log(this.state.latitude,"hhhhh")
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* Headers */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", flexDirection: "row" }}>

                            <TouchableOpacity style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: 'center', justifyContent: "center" }}>
                                <Text style={[styles.text, { color: "#fff" }]}>Create Doctor</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: 'center', justifyContent: "center" }}>

                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ height: height * 0.12, alignItems: "center", justifyContent: 'center' }}>
                                <Image
                                    source={{ uri: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" }}
                                    style={{ height: 60, width: 60, borderRadius: 30 }}
                                />

                                <TouchableOpacity style={{ position: "absolute", right: 140 }}

                                    onPress={() => { this.setState({ openImageModal: true, }) }}
                                >
                                    <Entypo name="edit" size={20} color={themeColor} />
                                </TouchableOpacity>
                            </View>


                            <ScrollView style={{ margin: 20 }}
                                showsVerticalScrollIndicator={false}
                            >
                                <View >
                                    <Text style={styles.text}>Name</Text>
                                    <TextInput
                                        value={this.state.Name}
                                        onChangeText={(Name)=>{this.setState({Name})}}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.text}>Clinic Name</Text>
                                    <TextInput
                                        value={this.state.clinicName}
                                        onChangeText={(clinicName) => { this.setState({ clinicName }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View style={{height:height*0.07,flexDirection:"row",}}>
                                    <View style={{flex:0.5}}>
                                        <Text style={styles.text}>Opening Time</Text>
                                        <View style={{flexDirection:"row",marginTop:5,alignItems:"center",}}>
                                            <TouchableOpacity 
                                              onPress={()=>{this.setState({show1:true})}}
                                            >
                                                <Entypo name="clock" size={24} color="black" />
                                             
                                            </TouchableOpacity>
                                         
                                            <Text style={{marginLeft:10}}>{this.state.openingTime}</Text>
                                        </View>
                                        
                                    </View>
                                 
                                    <View style={{flex:0.5,}}>
                                        <Text style={styles.text}>Closing Time</Text>
                                        <View style={{ flexDirection: "row", marginTop: 5, alignItems: "center", }}>
                                            <TouchableOpacity 
                                               onPress={()=>{this.setState({show2:true})}}
                                            >
                                                <Entypo name="clock" size={24} color="black" />
                                                
                                            </TouchableOpacity>
                                           
                                            <Text style={{marginLeft:10}}>{this.state.closingTime}</Text>
                                        </View>
                                    
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.text}>Phone No</Text>
                                    <TextInput
                                        value={this.state.PhoneNO}
                                        onChangeText={(PhoneNO) => { this.setState({ PhoneNO }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Age</Text>
                                    <TextInput
                                        value={this.state.Age}
                                        onChangeText={(Age) => { this.setState({ Age }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Specialization</Text>
                                    <TextInput
                                        onChangeText={(Specialization) => { this.setState({ Specialization }) }}
                                        value={this.state.Specialization}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Experience</Text>
                                    <TextInput
                                        onChangeText={(Experience) => { this.setState({ Experience }) }}
                                        value={this.state.Experience}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>No of clinics handling</Text>
                                    <TextInput
                                    value={this.state.NoOfClinics}
                                        onChangeText={(NoOfClinics) => { this.setState({ NoOfClinics }) }}
                                        keyboardType="numeric"
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Location</Text>
                                    <TextInput
                                         value={this.state.Location}
                                        onChangeText={(Location) => { this.setState({ Location }) }}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Latitude</Text>
                                    <TextInput
                                        value={this.state?.latitude.toString()}
                                        multiline={true}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.text}>Longitude</Text>
                                    <TextInput
                                        value={this.state?.longitude.toString()}
                                        multiline={true}
                                        selectionColor={themeColor}
                                        style={{ width: width * 0.8, height: height * 0.05, borderRadius: 15, backgroundColor: "#eeee", margin: 10, paddingLeft: 10 }}
                                    />
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={{ width: width * 0.4, height: height * 0.05, borderRadius: 10, alignItems: 'center', justifyContent: "center", backgroundColor: themeColor }}>
                                        <Text style={[styles.text, { color: "#fff" }]}>Update</Text>
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>

                        </View>

                        {this.renderModal()}
                        {/* {this.state.show1&& (
                            <DateTimePicker
                                testID="TimePicker1"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                display="default"
                                onChange={(time) => { this.onChange1(time) }}
                            />
                        )}
                        {this.state.show2&& (
                            <DateTimePicker
                                testID="TimePicker2"
                                value={this.state.date}
                                mode={this.state.mode}
                                is24Hour={false}
                                display="default"
                                onChange={(time) => { this.onChange2(time) }}
                            />
                        )} */}
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
    modalView1: {
        backgroundColor: '#fff',
        marginHorizontal: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'flex-end',
        width: width
    }
})

const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(CreateDoctor)