import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, Entypo, AntDesign, MaterialIcons} from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import HttpsClient from '../api/HttpsClient';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
class CreateBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerNo:"8973591775",
            customerName:"kamaraj",
            Amount:"0",
            Discount:"0",
            show:false,
            today: moment(new Date()).format("YYYY-MM-DD"),
            MedicineName:"",
            medicines:[],
            selectedItem:null,
            quantity:"",
            billMedicines:[]
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
    hideDatePicker = () => {
        this.setState({ show: false })
    };
    handleConfirm = (date) => {

        this.setState({ today: moment(date).format('YYYY-MM-DD'), show: false, date: new Date(date) }, () => {


        })
        this.hideDatePicker();
    };

    searchMedicine = async (Medicine) => {
        if(this.state.selectedItem!=null){
            this.setState({selectedItem:null})
        }
        this.setState({ MedicineName: Medicine })
        if (Medicine != "") {
            let api = `${url}/api/prescription/subSearch/?name=${Medicine}&inventory=${this?.props?.medical?.inventory || this?.props?.clinic?.inventory}`
           console.log(api)
            let data = await HttpsClient.get(api)
            if (data.type == "success") {
                this.setState({ medicines: data.data })
            }
        } else {
            this.setState({ medicines: [] })
        }
    }
    addMedicine =()=>{
        if(this.state.selectedItem==null){
            return this.showSimpleMessage("Please select Medicine", "#dd7030",)
        }
        if (this.state.quantity == "") {
            return this.showSimpleMessage("Please select quantity", "#dd7030",)
        }
        let totalAmount = Number(this.state.Amount)
        totalAmount = totalAmount + this.state.selectedItem.price * Number(this.state.quantity)
        let duplicate = this.state.billMedicines
        let pushObject ={
            Medicine:this.state.selectedItem,
            quantity:this.state.quantity,
            price: this.state.selectedItem.price * this.state.quantity,
            item: this.state.selectedItem,
            itemprice:this.state.selectedItem.price * this.state.quantity
        
           
        }
        duplicate.push(pushObject)
        this.setState({ billMedicines:duplicate,Amount:totalAmount.toString()},()=>{
            this.setState({ selectedItem: null, quantity: "", MedicineName:""})
        })

    }
    addQuantity = (quantity)=>{
        if(this.state.selectedItem ==null){
            return this.showSimpleMessage("Please select Medicine", "#dd7030",)

        }
        this.setState({quantity})
    }
    createBill =async()=>{
        this.setState({creating:true})
        if(this.state.customerName==""){
            return this.showSimpleMessage("Please Enter customer Name", "#dd7030",)
        }
        if (this.state.customerNo == "") {
            return this.showSimpleMessage("Please Enter customer Number", "#dd7030",)
        }
        if(this.state.billMedicines.length==0){
            return this.showSimpleMessage("Please Add Medicines", "#dd7030",)
        }
        let api =`${url}/api/prescription/createBill/`
        let sendData  ={
            contact_details:this.state.customerName,
            contact_no:this.state.customerNo,
            date:this.state.today,
            discount:this.state.Discount,
            total:this.state.Amount,
            inventory: this?.props?.medical?.inventory || this?.props?.clinic?.inventory,
            items:this.state.billMedicines,
            amount:this.state.Amount
        }
       let post =  await HttpsClient.post(api,sendData)
       console.log(post,"pp")
       if(post.type =="success"){
           this.setState({ creating: false })
  this.showSimpleMessage("Bill created SuccessFully", "#00A300", "success")
           return this.props.navigation.goBack()
       }else{
           this.setState({ creating: false })
           return this.showSimpleMessage("Try again", "#B22222", "danger")
       }
    }
    renderHeader =()=>{
        return(
            <View style={{flexDirection:"row"}}>
                 <View style={{width:width*0.1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={[styles.text,{color:"#000"}]}>#</Text>
                 </View>
                <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text,{color:"#000"}]}>Name</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text,{color:'#000'}]}>Type</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text,{color:'#000'}]}>Quantity</Text>
                </View>
                <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.text,{color:"#000"}]}>Price</Text>
                </View>
                <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: 'center' }}>
                    
                </View>
            </View>
        )
    }
    editItem =(item,index)=>{
        let totalAmount = Number(this.state.Amount)
        totalAmount = totalAmount - item.price
        this.setState({ selectedItem: item.Medicine, MedicineName: item.Medicine.title, quantity: item.quantity, Amount: totalAmount.toString()},()=>{
            let duplicate= this.state.billMedicines
            duplicate.splice(index,1)
            this.setState({ billMedicines: duplicate})
        })
    }
    removeItem =(item,index)=>{
        let totalAmount = Number(this.state.Amount)
        totalAmount = totalAmount - item.price
        let duplicate = this.state.billMedicines
        duplicate.splice(index, 1)
        this.setState({ billMedicines: duplicate, Amount: totalAmount.toString()})
    }
    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    {/* Headers */}
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Create Bill</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>
                    {/* FORM */}

                    <ScrollView 
                      keyboardShouldPersistTaps={"handled"}
                    >

                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                            <View style={{}}>
                                <Text style={[styles.text, { color: "#000" }]}>Customer No</Text>
                            </View>

                            <TextInput
                                keyboardType={"numeric"}
                                value={this.state.customerNo}
                                onChangeText={(customerNo) => { this.setState({ customerNo }) }}
                                style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                selectionColor={themeColor}
                            />


                        </View>
                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                            <View style={{}}>
                                <Text style={[styles.text, { color: "#000" }]}>Customer Name</Text>
                            </View>

                            <TextInput
                                value={this.state.customerName}
                                onChangeText={(customerName) => { this.setState({ customerName }) }}
                                style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                selectionColor={themeColor}
                            />


                        </View>
                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                            <View style={{}}>
                                <Text style={[styles.text, { color: "#000" }]}>Discount</Text>
                            </View>
                            <TextInput
                                keyboardType={"numeric"}
                                value={this.state.Discount}
                                onChangeText={(Discount) => { this.setState({ Discount }) }}
                                style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                selectionColor={themeColor}
                            />


                        </View>
                        <TouchableWithoutFeedback 
                        
                            onPress={() => { this.showSimpleMessage("Please select Medicine", "#dd7030",)}}
                        >
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { color: "#000" }]}>Amount</Text>
                                </View>

                                <TextInput

                                    editable={false}
                                    keyboardType={"numeric"}
                                    value={this.state.Amount}
                                    onChangeText={(Amount) => { this.setState({ Amount }) }}
                                    style={{ height: height * 0.05, width: width * 0.9, backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 5 }}
                                    selectionColor={themeColor}
                                />


                            </View>
                        </TouchableWithoutFeedback>
                    
                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                            <View style={{}}>
                                <Text style={[styles.text, { color: "#000" }]}>Date</Text>
                            </View>

                            <View
                                style={{
                                    height: height * 0.05,
                                    width: width * 0.9,
                                    backgroundColor: "#eee",
                                    borderRadius: 10,
                                    flexDirection: "row",
                                    marginTop: 5,
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingHorizontal: 20
                                }}

                            >
                                <View>
                                    <Text style={[styles.text]}>{this.state.today}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ show: true }) }}
                                >
                                    <MaterialIcons name="date-range" size={24} color="black" />
                                </TouchableOpacity>
                            </View>


                        </View>
                  
                        <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
                            <View style={{ flex: 0.6, }}>
                                <Text style={[styles.text, { marginLeft: 10, color: "#000" }]}>Medicine</Text>
                                <TextInput
                                    style={{ width: "90%", height: height * 0.05, backgroundColor: "#eee", borderRadius: 5, marginTop: 10, alignSelf: "center" }}
                                    selectionColor={themeColor}
                                    value={this.state.MedicineName}
                                    onChangeText={(MedicineName) => { this.searchMedicine(MedicineName) }}
                                />
                                {this.state.medicines.length > 0 && <View style={{ position: "relative", width: width * 0.9, height: height * 0.2, alignItems: 'center', justifyContent: 'space-around', top: 5, backgroundColor: "#fff", borderRadius: 10 }}>
                                    {
                                        this.state.medicines.map((item, index) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ MedicineName: item.title, selectedItem: item }, () => {
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
                            <View style={{ flex: 0.4 }}>
                                <View style={{}}>
                                    <Text style={[styles.text, { color: "#000" }]}>Quantity</Text>
                                </View>

                                <TextInput

                                    keyboardType={"numeric"}
                                    value={this.state.quantity}
                                    onChangeText={(quantity) => { this.addQuantity(quantity) }}
                                    style={{ height: height * 0.05, width: "90%", backgroundColor: "#eee", borderRadius: 10, paddingLeft: 10, marginTop: 10 }}
                                    selectionColor={themeColor}
                                />


                            </View>
                        </View>
                        <View>
                           
                        </View>
                        <DateTimePickerModal
                            testID="2"
                            isVisible={this.state.show}
                            mode="date"
                            onConfirm={this.handleConfirm}
                            onCancel={this.hideDatePicker}
                        />
                        <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: themeColor, borderRadius: 5 }}
                                onPress={() => {
                                   this.addMedicine()
                                }}
                            >
                                <Text style={[styles.text, { color: "#fff" }]}>Add </Text>
                            </TouchableOpacity>
                        </View>
                         <ScrollView
                            keyboardShouldPersistTaps={"handled"}
                           horizontal={true}
                           showsHorizontalScrollIndicator ={false}
                         >
                           <FlatList 
                                keyboardShouldPersistTaps={"handled"}
                             data ={this.state.billMedicines}
                             keyExtractor ={(item,index)=>index.toString()}
                             ListHeaderComponent ={this.renderHeader()}
                             renderItem ={({item,index})=>{
                               return(
                                   <View style={{ flexDirection: "row",marginTop:5 }}>
                                       <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: 'center' }}>
                                           <Text style={[styles.text]}>{index+1}</Text>
                                       </View>
                                       <View style={{ width: width * 0.3, alignItems: 'center', justifyContent: 'center' }}>
                                           <Text style={[styles.text]}>{item.Medicine.title}</Text>
                                       </View>
                                       <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                           <Text style={[styles.text]}>{item.Medicine.type}</Text>
                                       </View>
                                       <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                           <Text style={[styles.text]}>{item.quantity}</Text>
                                       </View>
                                       <View style={{ width: width * 0.2, alignItems: 'center', justifyContent: 'center' }}>
                                           <Text style={[styles.text]}>{item.price}</Text>
                                       </View>
                                       <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: 'center' }}>
                                           <TouchableOpacity 
                                            onPress={()=>{this.editItem(item,index)}}
                                           
                                           >
                                               <Entypo name="edit" size={24} color="blue" />
                                           </TouchableOpacity>
                                         
                                       </View>
                                       <View style={{ width: width * 0.1, alignItems: 'center', justifyContent: 'center' }}>
                                           <TouchableOpacity 
                                               onPress={() => { this.removeItem(item,index) }}
                                           
                                           >
                                               <Entypo name="circle-with-cross" size={24} color="red" />
                                           </TouchableOpacity>

                                       </View>
                                   </View>
                               )
                             }}
                           />
                         </ScrollView>
                        <View style={{ marginHorizontal: 20, marginVertical: 10, alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={{ height: height * 0.05, width: width * 0.4, alignItems: "center", justifyContent: "center", backgroundColor: "#461482", borderRadius: 5 }}
                                onPress={() => {
                                     this.createBill() 
                                }}
                            >
                                 {
                                     this.state.creating?<ActivityIndicator  size={"large"} color={"#fff"}/>:
                                        <Text style={[styles.text, { color: "#fff" }]}>Create</Text>
                                 }
                               
                            </TouchableOpacity>
                        </View>
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
export default connect(mapStateToProps, { selectTheme })(CreateBill);