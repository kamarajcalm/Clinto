import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Alert, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height;
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { ActivityIndicator } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import * as ScreenOrientation from 'expo-screen-orientation';
const url = settings.url;
let types = [
    {
        label: "Tablet", value: 'Tablet'
    },
    {
        label: "Drops", value: 'Drops'
    },
    {
        label: "Others", value: 'Others'
    },
    {
        label: "Capsules", value: 'Capsules'
    },
    {
        label: "Liquid", value: 'Liquid'
    },

    {
        label: "Cream", value: 'Cream'
    },
    {
        label: "Injections", value: 'Injections'
    },
]
class AddRackItem extends Component {
    constructor(props) {

        super(props);
        this.state = {
            modal: false,
            MedicineName: "",
            Price: '',
            piecesPerBox: "",
            type: types[0].value,
            items: [],
            medicines: [],
            stripesPerBox: "0",
            medicinesPerStrips: "",
            minQty: ""
        };
    }
    componentDidMount() {

    }
    showSimpleMessage(content, color, type = "info", props = {}) {
        const message = {
            message: content,
            backgroundColor: color,
            icon: { icon: "auto", position: "left" },
            type,
            ...props,
        };

        showMessage(message);
    }
    addMedicine = async () => {
        this.setState({ creating: true })
        if (this.state.MedicineName == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add MedicineName", "#dd7030",)
        }
        if (this.state.Price == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add Price", "#dd7030",)
        }
        if (this.state.minQty == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add Min Qty", "#dd7030",)
        }
        if (this.state.type == "Tablet" || this.state.type == "Capsules") {
            if (this.state.stripesPerBox == "0" || this.state.stripesPerBox == "") {
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add stripesPerBox", "#dd7030",)
            }
            if (this.state.medicinesPerStrips == "") {
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add medicinesPerStrips", "#dd7030",)
            }
        }
        if (this.state.type != "Tablet" && this.state.type != "Capsules") {
            console.log(this.state.type, "ppip")
            if (this.state.piecesPerBox == "") {
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add piecesPerBox", "#dd7030",)
            }
        }
        let api = `${url}/api/prescription/createSubs/`
        let sendData = {
            title: this.state.MedicineName,
            price: this.state.Price,
            min_quantity: this.state.minQty,
            strips_per_boxes: this.state.stripesPerBox,
            type: this.state.type,
            category: this.props.route.params.item.id
        }
        if (this.state.type == "Tablet" || this.state.type == "Capsules") {
            sendData.medicines_per_strips = this.state.medicinesPerStrips
        } else {
            sendData.medicines_per_strips = this.state.piecesPerBox
        }

        let post = await HttpsClient.post(api, sendData)
        console.log(post)
        if (post.type == "success") {
            this.setState({ modal: false })
            this.setState({ creating: false })
            this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          return  this.props.navigation.goBack()
        } else {
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    searchMedicine = async (name) => {
        this.setState({ MedicineName: name })
        if (name != "") {
            let api = `${url}/api/prescription/medicines/?name=${name}`
            console.log(api, "ppp")
            let data = await HttpsClient.get(api)
            if (data.type == "success") {
                this.setState({ medicines: data.data })
            }
        } else {
            this.setState({ medicines: [] })
        }

    }
 
    validateBoxes = () => {
        const { height, width } = Dimensions.get("window");
        if (this.state.type == "Tablet" || this.state.type == "Capsules")
            return (
                <>
                    <View style={{ margin: 20 }}>
                        <Text style={[styles.text, { color: '#000' }]}>No of Strips per box</Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.stripesPerBox}
                            onChangeText={(stripesPerBox) => { this.setState({ stripesPerBox }) }}
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Text style={[styles.text, { color: '#000' }]}>No of {this.state.type == "Tablet" ? "Tablets" :"Capsules"} Per Strip </Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.medicinesPerStrips}
                            onChangeText={(medicinesPerStrips) => { this.setState({ medicinesPerStrips }) }}
                        />
                    </View>
                </>
            )
        return (
            <View style={{ margin: 20 }}>
                <Text style={[styles.text, { color: '#000' }]}>No of Pieces </Text>
                <TextInput
                    keyboardType={"numeric"}
                    style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 5, marginTop: 10 }}
                    selectionColor={themeColor}
                    value={this.state.piecesPerBox}
                    onChangeText={(piecesPerBox) => { this.setState({ piecesPerBox }) }}
                />
            </View>
        )
    }
    render() {
        const { height, width } = Dimensions.get("window");
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ height: height * 0.12, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={ async() => { 
                              await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                                this.props.navigation.goBack() 
                            }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Add Item</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>
                    <ScrollView style={{  }}
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableWithoutFeedback

                            onPress={() => {

                                this.setState({ medicines: [] })
                            }}
                        >
                            <>

                                <View style={{ margin: 20 }}>
                                    <Text style={[styles.text, { color: '#000' }]}>Enter Medicine Name</Text>
                                    <TextInput
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 5, marginTop: 10 }}
                                        selectionColor={themeColor}
                                        value={this.state.MedicineName}
                                        onChangeText={(MedicineName) => { this.searchMedicine(MedicineName) }}
                                    />
                                    {this.state.medicines.length > 0 && <View style={{ position: "relative", width: width * 0.8, height: height * 0.2, alignItems: 'center', justifyContent: 'space-around', top: 5, backgroundColor: "#fff", borderRadius: 10 }}>
                                        {
                                            this.state.medicines.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({ MedicineName: item.title, type: item.type }, () => {
                                                                this.setState({ medicines: [] })
                                                            })
                                                        }}
                                                        key={index}
                                                        style={{ padding: 5, backgroundColor: "blue", marginVertical: 5, borderRadius: 5 }}
                                                    >
                                                        <Text style={[styles.text, { color: "#fff" }]}>{item.title}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>}
                                </View>

                                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                                    <Text style={[styles.text, { color: '#000' }]}>Select Medicine Type</Text>
                                    <View style={{ marginTop: 10 }}>
                                        <DropDownPicker
                                            items={types}

                                            defaultValue={this.state.type}
                                            containerStyle={{ height: 40, width: width * 0.8 }}
                                            style={{ backgroundColor: '#fafafa' }}
                                            itemStyle={{
                                                justifyContent: 'flex-start'
                                            }}
                                            dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.8 }}

                                            onChangeItem={(item) => {
                                                this.setState({ type: item.value })
                                            }}
                                        />
                                    </View>

                                </View>
                                <View style={{ margin: 20 }}>
                                    <Text style={[styles.text, { color: '#000' }]}>Selling Price per Piece</Text>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafafa", borderRadius: 5, marginTop: 10 }}
                                        selectionColor={themeColor}
                                        value={this.state.Price}
                                        onChangeText={(Price) => { this.setState({ Price }) }}
                                    />
                                </View>
                                {
                                    this.validateBoxes()
                                }
                                <View style={{ margin: 20 }}>
                                    <Text style={[styles.text, { color: '#000' }]}>Minimum Quantity</Text>
                                    <TextInput
                                        keyboardType={"numeric"}
                                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fafafa", borderRadius: 5, marginTop: 10 }}
                                        selectionColor={themeColor}
                                        value={this.state.minQty}
                                        onChangeText={(minQty) => { this.setState({ minQty }) }}
                                    />
                                </View>
                                <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                                    <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.4, alignItems: 'center', justifyContent: 'center', marginTop: 25, borderRadius: 5 }}
                                        onPress={() => { this.addMedicine() }}
                                    >
                                        {!this.state.creating ? <Text style={[styles.text, { color: '#fff' }]}>Add</Text> :
                                            <ActivityIndicator size={"small"} color={"#fff"} />
                                        }
                                    </TouchableOpacity>
                                </View>
                            </>
                        </TouchableWithoutFeedback>
                    </ScrollView>
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
        user: state.selectedUser,
        medical: state.selectedMedical,
        clinic: state.selectedClinic

    }
}
export default connect(mapStateToProps, { selectTheme })(AddRackItem);