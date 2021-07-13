import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Alert, ScrollView, TouchableWithoutFeedback, Switch, ActivityIndicator} from 'react-native';
import { Ionicons, Entypo, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height;
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { color } from 'react-native-reanimated';
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
class TypeWiseView extends Component {
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
            minQty: "",
            offset:0,
            rack:false,
            selectedType: types[0].value,
            next:true,
            loading: true
        };
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
            this.getItems()
        } else {
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    getItems = async () => {
        
        let api = `${url}/api/prescription/maincategory/?limit=7&offset=${this.state.offset}&inventory=${this?.props?.medical?.inventory || this?.props?.clinic?.inventory}&typewise=${this.state.selectedType}`
        let data = await HttpsClient.get(api)
        if (data.type == "success") {
            this.setState({ items: data.data.results,loading:false})
            if(data.data.next == null){
                this.setState({next:false})
            }
        }
    }
    componentDidMount() {
        this.getItems()
    }
    deleteCategory = async (item) => {
        let api = `${url}/api/prescription/maincategory/${item.id}/`
        let del = await HttpsClient.delete(api)
        if (del.type == "success") {
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            this.getItems()
        } else {
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
                        <Text style={[styles.text, { color: '#000' }]}>No of Strips Per Box</Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.stripesPerBox}
                            onChangeText={(stripesPerBox) => { this.setState({ stripesPerBox }) }}
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Text style={[styles.text, { color: '#000' }]}>No of Medicines Per Stripes</Text>
                        <TextInput
                            keyboardType={"numeric"}
                            style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                            selectionColor={themeColor}
                            value={this.state.medicinesPerStrips}
                            onChangeText={(medicinesPerStrips) => { this.setState({ medicinesPerStrips }) }}
                        />
                    </View>
                </>
            )
        return (
            <View style={{ margin: 20 }}>
                <Text style={[styles.text, { color: '#000' }]}>No of Pieces per Box</Text>
                <TextInput
                    keyboardType={"numeric"}
                    style={{ width: width * 0.8, height: height * 0.1, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                    selectionColor={themeColor}
                    value={this.state.piecesPerBox}
                    onChangeText={(piecesPerBox) => { this.setState({ piecesPerBox }) }}
                />
            </View>
        )
    }
    modal = () => {
        const { height, width } = Dimensions.get("window");
        return (
            <Modal
                statusBarTranslucent={true}
                deviceHeight={screenHeight}
                isVisible={this.state.modal}
                onBackdropPress={() => { this.setState({ modal: false }) }}
                useNativeDriverForBackdrop={true}
            >
                <View style={{ justifyContent: "center",height:height*0.7 ,backgroundColor:"#fff",alignItems:"center",width:width*0.6,alignSelf:"center",borderRadius:10}}>
                 
                 <FlatList 
                   style={{width:width*0.6}}
                   data={types}
                   keyExtractor={(item,index)=>index.toString()}
                   renderItem ={({item,index})=>{
                       return(
                           <TouchableOpacity style={{marginTop:10,alignItems:"center",justifyContent:"center",flexDirection:"row"}}
                             onPress={()=>{this.setState({selectedType:item.label,modal:false},()=>{
                                 this.getItems()
                             })}}
                           >
                               <View style={{flex:0.3}}>
                                   <View style={{alignSelf:"flex-end"}}>
                                       <FontAwesome name="dot-circle-o" size={24} color={this.state.selectedType==item.label?"#000":"gray"} />
                                   </View>
                                
                               </View>
                               <View style={{flex:0.5}}>
                                   <View style={{marginLeft:20}}>
                                       <Text style={[styles.text, { color: "#000" }]}>{item.label}</Text>
                                   </View>
                               
                               </View>
                           </TouchableOpacity>
                       )
                   }}
                 />


                </View>
            </Modal>
        )
    }
    createAlert = (item) => {
        Alert.alert(
            "Do you want to delete?",
            `${item.title}`,
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => { this.deleteCategory(item) } }
            ]
        );

    }
    renderHeader = () => {
        const { height, width } = Dimensions.get("window");
        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>#</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Name</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Type</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text, { color: "#000" }]}>Price</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}> Boxes</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>strips</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Pieces</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Min-qty</Text>
                </View>
                <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Total</Text>
                </View>
                <View style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}>

                </View>
            </View>
        )
    }
    toggleSwitch =()=>{
        this.props.navigation.goBack()
    }
    loadMore =()=>{
        if(this.state.next){
              this.setState({offset:this.state.offset+7},()=>{
                  this.getItems()
              })
        }
        return
    }
    renderFooter  =()=>{
        if(this.state.loading){
            return(
                <ActivityIndicator size ={"large"} color={themeColor}/>
            )
        }

        return null
    }
    render() {
        const { height, width } = Dimensions.get("window");
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    {/*headers  */}
                    <View style={{ height: height * 0.15, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                           
                        >
                           
                        </TouchableOpacity>
                        <View style={{ flex: 0.75,flexDirection:"row" ,alignItems:"center",justifyContent:"space-between"}}>
                            <TouchableOpacity
                              onPress={()=>{this.setState({modal:true})}}
                              style={{flexDirection:"row"}}
                            >
                                <View>
                                    <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>{this.state.selectedType}</Text>
                                </View>
                                <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Entypo name="chevron-small-down" size={24} color="#fff" />
                                </View>
                       
                            </TouchableOpacity>
                         
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Text style={[styles.text, { color: "#fff" }]}>Rack View</Text>
                                </View>
                             
                                <Switch
                                    style={{}}
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={this.state.rack ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => { this.toggleSwitch() }}
                                    value={this.state.rack}
                                />
                            </View>
                        </View>

                    </View>

                    <FlatList
                        ListFooterComponent={this.renderFooter()}
                        ListHeaderComponent={this.renderHeader()}
                        data={this.state.items}
                        onEndReached ={()=>{this.loadMore()}}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={{ flexDirection: "row", marginTop: 5, backgroundColor: "#eee", paddingVertical: 10 }}
                                    onPress={() => { this.props.navigation.navigate('ViewItem', { item }) }}
                                >
                                    <View style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { color: "#000" }]}>{index + 1}</Text>
                                    </View>
                                    <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { color: "#000" }]}>{item.title}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { color: "#000" }]}>{item.type}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text, { color: "#000" }]}>{item.price}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text], { color: "#000" }}>{item.totalBoxes}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text], { color: "#000" }}>{item.strips_per_boxes}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text], { color: "#000" }}>{item.medicines_per_strips}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text], { color: "#000" }}>{item.min_quantity}</Text>
                                    </View>
                                    <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                        <Text style={[styles.text], { color: "#000" }}>{item.total_quantity}</Text>
                                    </View>
                                    <TouchableOpacity style={{ flex: 0.05, alignItems: "center", justifyContent: "center" }}
                                        onPress={() => { this.createAlert(item) }}
                                    >
                                        <Entypo name="cross" size={20} color="red" />
                                    </TouchableOpacity>

                                </TouchableOpacity>
                            )
                        }}
                    />

                    {/* <View style={{
                        position: "absolute",
                        bottom: 50,
                        left: 20,
                        right: 20,
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",

                        borderRadius: 20
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.setState({ modal: true }) }}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
                    </View> */}
                    {
                        this.modal()
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
        clinic:state.selectedClinic
    }
}
export default connect(mapStateToProps, { selectTheme })(TypeWiseView);