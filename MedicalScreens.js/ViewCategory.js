import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, Alert, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { Ionicons, Entypo, AntDesign ,FontAwesome,FontAwesome5} from '@expo/vector-icons';
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
class ViewCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal:false,
          MedicineName:"",
          Price:'',
          piecesPerBox:"",
          type:types[0].value,
          items:[],
          medicines:[],
          stripesPerBox:"0",
          medicinesPerStrips:"",
          minQty:""
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
    addMedicine = async()=>{
        this.setState({creating:true})
        if(this.state.MedicineName ==""){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add MedicineName", "#dd7030",)
        }
        if (this.state.Price == "") {
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add Price", "#dd7030",)
        }
        if(this.state.minQty ==""){
            this.setState({ creating: false })
            return this.showSimpleMessage("Please add Min Qty", "#dd7030",)
        }
        if (this.state.type == "Tablet" || this.state.type == "Capsules"){
            if (this.state.stripesPerBox == "0" || this.state.stripesPerBox ==""){
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add stripesPerBox", "#dd7030",)
            }
            if (this.state.medicinesPerStrips ==""){
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add medicinesPerStrips", "#dd7030",)
            }
        }
        if (this.state.type !="Tablet" && this.state.type !="Capsules"){
            console.log(this.state.type,"ppip")
            if(this.state.piecesPerBox ==""){
                this.setState({ creating: false })
                return this.showSimpleMessage("Please add piecesPerBox", "#dd7030",)
            }
        }
        let api = `${url}/api/prescription/createSubs/`
        let sendData ={
            title: this.state.MedicineName,
            price:this.state.Price,
            min_quantity:this.state.minQty,
            strips_per_boxes:this.state.stripesPerBox,
            type:this.state.type,
            category:this.props.route.params.item.id
        }
        if(this.state.type=="Tablet" ||this.state.type =="Capsules"){
            sendData.medicines_per_strips = this.state.medicinesPerStrips
        }else{
            sendData.medicines_per_strips =this.state.piecesPerBox
        }
        
        let post = await HttpsClient.post(api,sendData)
        console.log(post)
        if(post.type =="success"){
            this.setState({modal:false})
            this.setState({ creating: false })
            this.showSimpleMessage("Added SuccessFully", "#00A300", "success")
            this.getItems()
        }else{
            this.setState({ creating: false })
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    getItems =async()=>{
        let api = `${url}/api/prescription/maincategory/?category=${this.props.route.params.item.id}`
        let data = await HttpsClient.get(api)
        if(data.type =="success"){
              this.setState({items:data.data})
        }
    }
    componentDidMount(){
        this.getItems()
    }
    deleteCategory =async(item)=>{
        let api = `${url}/api/prescription/maincategory/${item.id}/`
        let del =await HttpsClient.delete(api)
        if(del.type =="success"){
            this.showSimpleMessage("Deleted SuccessFully", "#00A300", "success")
            this.getItems()
        }else{
            this.showSimpleMessage("Try again", "#B22222", "danger")
        }
    }
    searchMedicine = async(name)=>{
        this.setState({ MedicineName: name })
        if(name!=""){
            let api = `${url}/api/prescription/medicines/?name=${name}`
            console.log(api,"ppp")
            let data = await HttpsClient.get(api)
            if (data.type == "success") {
                this.setState({ medicines: data.data })
            }
        }else{
            this.setState({ medicines: [] })
        }
     
    }
    validateBoxes =()=>{
        if (this.state.type== "Tablet" || this.state.type== "Capsules")
        return(
            <>
            <View style={{ margin: 20 }}>
                <Text style={[styles.text, { color: '#000' }]}>No of Strips Per Box</Text>
                <TextInput
                    keyboardType={"numeric"}
                    style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                    selectionColor={themeColor}
                    value={this.state.stripesPerBox}
                    onChangeText={(stripesPerBox) => { this.setState({ stripesPerBox }) }}
                />
            </View>
                <View style={{ margin: 20 }}>
                    <Text style={[styles.text, { color: '#000' }]}>No of Medicines Per Stripes</Text>
                    <TextInput
                        keyboardType={"numeric"}
                        style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                        selectionColor={themeColor}
                        value={this.state.medicinesPerStrips}
                        onChangeText={(medicinesPerStrips) => { this.setState({ medicinesPerStrips }) }}
                    />
                </View>
            </>
        )
        return(
            <View style={{ margin: 20 }}>
                <Text style={[styles.text, { color: '#000' }]}>No of Pieces per Box</Text>
                <TextInput
                    keyboardType={"numeric"}
                    style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                    selectionColor={themeColor}
                    value={this.state.piecesPerBox}
                    onChangeText={(piecesPerBox) => { this.setState({ piecesPerBox }) }}
                />
            </View>
        )
    }
    modal =()=>{
        return (
            <Modal
                deviceHeight={screenHeight}
                isVisible={this.state.modal}
                onBackdropPress={() => { this.setState({ modal: false }) }}
            >
                <View style={{  justifyContent:"center"}}>
                       
                        <ScrollView style={{ height: height * 0.5, backgroundColor: "#eee", borderRadius: 10, }}
                         showsVerticalScrollIndicator={false}
                        >
                            <TouchableWithoutFeedback 

                             onPress ={()=>{
                                 console.log("yuyuu")
                                 this.setState({medicines:[]})
                                }}
                            >
                             <>
                          
                            <View style={{ margin: 20 }}>
                                <Text style={[styles.text, { color: '#000' }]}>Enter Medicine Name</Text>
                                <TextInput
                                    style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                    selectionColor={themeColor}
                                    value={this.state.MedicineName}
                                onChangeText={(MedicineName) => { this.searchMedicine(MedicineName) }}
                                />
                            {this.state.medicines.length>0&&<View style={{ position: "relative", width: width * 0.8, height: height * 0.2, alignItems: 'center', justifyContent: 'space-around', top: 5, backgroundColor: "#fff",borderRadius:10 }}>
                                      {
                                          this.state.medicines.map((item,index)=>{
                                              return(
                                                  <TouchableOpacity
                                                      onPress={() => {
                                                          this.setState({ MedicineName: item.title, type: item.type},()=>{
                                                          this.setState({medicines:[]})
                                                      })}}
                                                    key={index}
                                                    style={{padding:5,backgroundColor:"blue",marginVertical:5,borderRadius:5}}
                                                  >
                                                      <Text style={[styles.text,{color:"#fff"}]}>{item.title}</Text>
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
                            <Text style={[styles.text, { color: '#000' }]}>Selling Price</Text>
                            <TextInput
                               keyboardType={"numeric"}
                                style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
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
                                style={{ width: width * 0.8, height: height * 0.05, backgroundColor: "#fff", borderRadius: 5, marginTop: 10 }}
                                selectionColor={themeColor}
                                value={this.state.minQty}
                                onChangeText={(minQty) => { this.setState({ minQty }) }}
                            />
                        </View>
                            <View style={{ alignItems: "center", justifyContent: "center" ,marginVertical:10}}>
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
    renderHeader =()=>{
        return (
            <View style={{flexDirection:'row',marginTop:10}}>
                <View style={{ width:width*0.1,alignItems:"center",justifyContent:"center"}}>
                    <Text style={[styles.text,{color:"#000"}]}>#</Text> 
                </View>
                <View style={{ width: width *0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Name</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Type</Text>
                </View>
                <View style={{ width: width *0.2, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text,{color:"#000"}]}>Price</Text>
                </View>
                <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text],{color:"#000"}}>No of Boxes</Text>
                </View>
                <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>No of Strips</Text>
                </View>
                <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>No of Pieces</Text>
                </View>
                <View style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Minimum Quantity</Text>
                </View>
                <View style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}>
                    <Text style={[styles.text], { color: "#000" }}>Total Quantity</Text>
                </View>
                <View style={{ width: width * 0.1, alignItems: "center", justifyContent: "center" }}>
                   
                </View>
            </View>
        )
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                     {/*headers  */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.7, }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>{this.props.route.params.item.title}</Text>
                        </View>

                    </View>
                  <ScrollView 
                    style={{width}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                        <FlatList
                            ListHeaderComponent={this.renderHeader()}
                            data={this.state.items}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        style={{ flexDirection: "row", marginTop: 5, backgroundColor: "#eee",paddingVertical:10 }}
                                        onPress={() => { this.props.navigation.navigate('ViewItem', { item }) }}
                                    >
                                        <View style={{ width: width * 0.1, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{index+1}</Text>
                                        </View>
                                        <View style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.title}</Text>
                                        </View>
                                        <View style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.type}</Text>
                                        </View>
                                        <View style={{ width: width * 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text, { color: "#000" }]}>{item.price}</Text>
                                        </View>
                                        <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.totalBoxes}</Text>
                                        </View>
                                        <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.strips_per_boxes}</Text>
                                        </View>
                                        <View style={{ width: width * 0.25, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.medicines_per_strips}</Text>
                                        </View>
                                        <View style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.min_quantity}</Text>
                                        </View>
                                        <View style={{ width: width * 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text], { color: "#000" }}>{item.total_quantity}</Text>
                                        </View>
                                        <TouchableOpacity style={{ width:width*0.1, alignItems: "center", justifyContent: "center" }}
                                            onPress={() => { this.createAlert(item) }}
                                        >
                                            <Entypo name="cross" size={20} color="red" />
                                        </TouchableOpacity>
                                   
                                    </TouchableOpacity>
                                )
                            }}
                        />
                  </ScrollView>
                    
                    <View style={{
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
                            onPress={() => { this.setState({modal:true})}}
                        >
                            <AntDesign name="pluscircle" size={40} color={themeColor} />
                        </TouchableOpacity>
                    </View>
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
        medical: state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(ViewCategory);