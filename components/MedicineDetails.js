import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Switch, TextInput } from 'react-native';
import settings from '../AppSettings'
import { AntDesign, Entypo ,FontAwesome5,FontAwesome} from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const inputColor = settings.TextInput;
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
const screenHeight = Dimensions.get("screen").height
import DropDownPicker from 'react-native-dropdown-picker';
export default class MedicineDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            afterFood: this.props.item.after_food ? true : false,
            morning: this.props.item.morning_count > 0 ? true : false,
            night: this.props.item.night_count > 0 ? true : false,
            afterNoon: this.props.item.afternoon_count > 0 ? true : false,
            morningCount: this.props.item.morning_count || 0,
            afterNoonCount: this.props.item.afternoon_count || 0,
            nightCount: this.props.item.night_count || 0,
            days: this.props.item.days.toString() || "",
            qty: '',
            comment: this.props.item.command || "",
            selectedVariant: "",
            name: "",
            containsDrugs: this.props.item.is_drug ? true : false,
            validTimes: "",
            diagnosis: [],
            selectedDiagnosis: null,
            showModal:false,
            typeModal:false
        };
    }
    toggleSwitch = () => {
        this.setState({ afterFood: !this.state.afterFood }, () => {
            this.props.changeFunction("after_food", this.state.afterFood, this.props.index)
        })
    }
    toggleDrug = () => {
        this.setState({ containsDrugs: !this.state.containsDrugs }, () => {
            this.props.changeFunction("containsDrugs", this.state.containsDrugs, this.props.index)
        })
    }
    changeDays = (text) => {
        this.setState({ days: text }, () => {
            this.props.changeFunction("days", this.state.days, this.props.index)
        })
    }
    changeValidTimes = (text) => {
        this.setState({ validTimes: text }, () => {
            this.props.changeFunction("validTimes", this.state.validTimes, this.props.index)
        })
    }
    changeQty = (text) => {
        this.setState({ qty: text }, () => {
            this.props.changeFunction("total_qty", this.state.qty, this.props.index)
        })
    }
    changeComment = (comment) => {
        this.setState({ comment: comment }, () => {
            this.props.changeFunction("comment", this.state.comment, this.props.index)
        })
    }
    changeVariant = (variant) => {

        this.props.changeFunction("variant", this.state.selectedVariant, this.props.index)

    }
    changeType = (item) => {
        this.props.changeFunction("type", item.value, this.props.index)
    }
    changeName = (name) => {
        this.setState({ name })
        this.props.changeFunction("name", name, this.props.index)
    }
    changeDiagnosis = (selectedDiagnosis) => {
        this.setState({ selectedDiagnosis })
        this.props.changeFunction("diagnosis", selectedDiagnosis, this.props.index)
    }
    getDiagnosis = () => {
        let diagnosis = []
        this.props.diagonsis.forEach((item) => {
            let pushObj = {
                label: item,
                value: item
            }
            diagnosis.push(pushObj)
        })
        this.setState({ diagnosis }, () => {
            if (this.props.item.diagonsis) {
                let index = this.props.diagonsis.findIndex((item) => {
                    return item == this.props.item.diagonsis
                })
                if (index != -1) {
                    this.setState({ selectedDiagnosis: this.state.diagnosis[index].value })
                }
            }
        })
    }

    componentDidMount() {
        this.getDiagnosis()
        if(this.props.item.manual){
             this.setState({name:this.props.item.title})
        }

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.diagonsis != this.props.diagonsis) {
            this.getDiagnosis()
        }

    }
    Modal =()=>{
        return (
            <Modal 
              isVisible={this.state.showModal}
              deviceHeight={screenHeight}
              statusBarTranslucent={true}
              onBackdropPress ={()=>{
                  this.setState({showModal:false})
              }}
            >
                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.4,width:width*0.8,backgroundColor:"#fff",borderRadius:10}}>
                             <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Select Diagnosis</Text>
                             </View>
                              {
                           this.state.diagnosis.map((item,index)=>{
                          
                                    return(
                                            <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                             onPress={()=>{
                                                this.setState({showModal:false},()=>{
                                                    this.changeDiagnosis(item.value)
                                                }) 
                                               }}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.label}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state.selectedDiagnosis===item.value?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                
                           })
                        }
                        </View>
                       
                </View>

            </Modal>
        )
    }
    changeTypeModal =(types)=>{
        return (
                   <Modal 
              isVisible={this.state.typeModal}
              deviceHeight={screenHeight}
              statusBarTranslucent={true}
              onBackdropPress ={()=>{
                  this.setState({typeModal:false})
              }}
            >
                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        <View style={{height:height*0.4,width:width*0.8,backgroundColor:"#fff",borderRadius:10}}>
                             <View style={{marginVertical:10,alignItems:"center",justifyContent:"center"}}>
                                 <Text style={[styles.text]}>Select Type</Text>
                             </View>
                              {
                                  types.map((item,index)=>{
                          
                                    return(
                                            <TouchableOpacity key={index} style={{flexDirection:"row",marginTop:10}}
                                             onPress={()=>{
                                                this.setState({typeModal:false},()=>{
                                                    this.changeType(item)
                                                }) 
                                               }}
                                            
                                            >
                                                <View style={{flex:0.7,alignItems:"center",justifyContent:"center"}}>
                                                    <Text style={[styles.text,{color:"#000",fontSize:height*0.02}]}>{item.label}</Text>
                                                </View>
                                                <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                                    <FontAwesome5 name="dot-circle" size={24} color={this.state.selectedDiagnosis===item.value?"#63BCD2":"gray"}/>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                
                           })
                        }
                        </View>
                       
                </View>

            </Modal>
        )
    }
    render() {
        const { item, index } = this.props
       
        if (item.type == "Tablet"|| item.type == "Capsules") {
            return (
                <View
                    key={index}
                    style={[styles.card,{}]}
                >
                    <View style={{margin:10, justifyContent:"center"}}>
                        <Text style={[styles.text, { fontWeight: "bold", fontSize: height*0.023 }]}> {this.props.medicinesGiven.length+this.props.index+1}. {item.title || item.medicine}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: 15, alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[styles.text,{fontSize:height*0.02}]}>Category :</Text>
                            <Text style={[styles.text, {fontSize:height*0.02}]}> {item.type}</Text>
                        </View>

                    </View>
       
                    <View style={{ flexDirection: "row", marginTop:10 ,flex:1}}>

                        <View style={{ flex: 1, justifyContent: "center" ,}}>

                            <View style={{ flexDirection: "row", }}>
                                <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                                    <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.morning ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({ morning: !this.state.morning }, () => {
                                                if (this.state.morning) {
                                                    this.props.changeFunction("morning_count", 0.5, index)
                                                    this.setState({ morningCount: 0.5})
                                                } else {
                                                    this.props.changeFunction("morning_count", 0, index)
                                                    this.setState({ morningCount: 0 })
                                                }
                                            })
                                        }}
                                    >
                                        <Text style={[styles.text, { color: "#fff",fontSize:height*0.02 }]}>Morning</Text>
                                    </TouchableOpacity>
                                    {this.state.morning && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ morningCount: this.state.morningCount - 0.5 }, () => {
                                                    this.props.changeFunction("morning_count", this.state.morningCount, index)
                                                    if (this.state.morningCount == 0) {

                                                        this.setState({ morning: !this.state.morning })
                                                    }
                                                })
                                            }}
                                        >
                                            <Entypo name="circle-with-minus" size={15} color="black" />
                                        </TouchableOpacity>

                                        <View>
                                            <Text style={[styles.text, { color: "gray" ,fontSize:height*0.02 }]}>{this.state.morningCount}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ morningCount: this.state.morningCount + 0.5 }, () => {
                                                    this.props.changeFunction("morning_count", this.state.morningCount, index)
                                                })
                                            }}
                                        >
                                            <AntDesign name="pluscircle" size={15} color="black" />
                                        </TouchableOpacity>
                                    </View>}
                                </View>
                                <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                                    <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.afterNoon ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({ afterNoon: !this.state.afterNoon }, () => {

                                                if (this.state.afterNoon) {
                                                    this.props.changeFunction("afternoon_count", 0.5, index)
                                                    this.setState({ afterNoonCount: 0.5 })
                                                } else {
                                                    this.props.changeFunction("afternoon_count", 0, index)
                                                    this.setState({ afterNoonCount: 0 })
                                                }

                                            })
                                        }}
                                    >
                                        <Text style={[styles.text, { color: "#fff" ,fontSize:height*0.02}]}>Afternoon</Text>
                                    </TouchableOpacity>
                                    {this.state.afterNoon && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ afterNoonCount: this.state.afterNoonCount - 0.5 }, () => {
                                                    this.props.changeFunction("afternoon_count", this.state.afterNoonCount, index)
                                                    if (this.state.afterNoonCount == 0) {
                                                        this.setState({ afterNoon: !this.state.afterNoon })
                                                    }
                                                })
                                            }}
                                        >
                                            <Entypo name="circle-with-minus" size={15} color="black" />
                                        </TouchableOpacity>


                                        <View>
                                            <Text style={[styles.text, { color: "gray" ,fontSize:height*0.02 }]}>{this.state.afterNoonCount}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ afterNoonCount: this.state.afterNoonCount + 0.5 }, () => {
                                                    this.props.changeFunction("afternoon_count", this.state.afterNoonCount, index)
                                                })
                                            }}
                                        >
                                            <AntDesign name="pluscircle" size={15} color="black" />
                                        </TouchableOpacity>
                                    </View>}
                                </View>
                                <View style={{ flex: 0.33, alignItems: 'center', justifyContent: "center" }}>
                                    <TouchableOpacity style={{ height: height * 0.03, width: width * 0.2, backgroundColor: this.state.night ? themeColor : "gray", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({ night: !this.state.night }, () => {
                                                if (this.state.night) {
                                                    this.props.changeFunction("night_count",0.5, index)
                                                    this.setState({ nightCount: 0.5})
                                                } else {
                                                    this.props.changeFunction("night_count", 0, index)
                                                    this.setState({ nightCount: 0 })
                                                }


                                            })
                                        }}
                                    >
                                        <Text style={[styles.text, { color: "#fff",fontSize:height*0.02 }]}>Night</Text>
                                    </TouchableOpacity>
                                    {this.state.night && <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-around", width: width * 0.15, marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ nightCount: this.state.nightCount - 0.5 }, () => {
                                                    this.props.changeFunction("night_count", this.state.nightCount, index)
                                                    if (this.state.nightCount == 0) {
                                                        this.setState({ night: !this.state.night })
                                                    }
                                                })
                                            }}
                                        >
                                            <Entypo name="circle-with-minus" size={15} color="black" />
                                        </TouchableOpacity>


                                        <View>
                                            <Text style={[styles.text, { color: "gray",fontSize:height*0.02 }]}>{this.state.nightCount}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ nightCount: this.state.nightCount + 0.5 }, () => {
                                                    this.props.changeFunction("night_count", this.state.nightCount, index)
                                                })
                                            }}
                                        >
                                            <AntDesign name="pluscircle" size={15} color="black" />
                                        </TouchableOpacity>
                                    </View>}
                                </View>

                            </View>

                        </View>
                    </View>
                    <>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop:10,paddingHorizontal:10}}>
                            {<View style={{ flexDirection: "row" }}>
                                <View style={{alignItems:"center",justifyContent:"center"}}>
                                    <Text style={[styles.text, { fontWeight: 'bold' ,fontSize:height*0.025}]}>After food</Text>
                                </View>
                               

                                <Switch
                                    style={{ marginLeft: 10 }}
                                    trackColor={{ false: '#767577', true: '#34eb40' }}
                                    thumbColor={this.state.afterFood ? '#fff' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => { this.toggleSwitch() }}
                                    value={this.state.afterFood}
                                />
                            </View>}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text>No of days</Text>
                                </View>
                                <View style={{marginTop:4}}>
                                           <TextInput
                                    value={this.state.days}
                                    selectionColor={themeColor}
                                    keyboardType="numeric"
                                    style={{ height:35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5, alignItems: "center", justifyContent: "center" }}
                                    onChangeText={(text) => { this.changeDays(text) }}

                                />
                                </View>
                         
                            </View>

                        </View>
                        <View style={{marginLeft: 10, alignItems: "center", marginTop: 10 }}>
                     
                            <TouchableOpacity style={{height:height*0.05,width:width*0.5,backgroundColor:inputColor,alignItems:"center",justifyContent:"space-around",flexDirection:"row"}}
                             onPress={()=>{
                                 this.setState({showModal:true})
                             }}
                            >   
                                  <View>
                                         <Text style={[styles.text]}>{this?.state?.selectedDiagnosis||"Select Diagnosis"}</Text>
                                  </View>
                                  <View>
                                      <Entypo name="chevron-small-down" size={20} color="black" />
                                  </View>
                            </TouchableOpacity>
                        </View>
                    </>
                    <View style={{ margin: 10 }}>
                        <Text>Comments:</Text>
                        <TextInput
                            selectionColor={themeColor}
                            multiline={true}
                            onChangeText={(comment) => { this.changeComment(comment) }}
                            style={{ height: height * 0.07, width: "100%", backgroundColor: "#eee", borderRadius: 10, marginTop: 10, textAlignVertical: "top", padding: 5 }}
                            value={this.state.comment}
                        />
                    </View>
                    <View>

                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", flex: 0.2, marginVertical: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[styles.text, { fontWeight: 'bold' }]}>Do not issue without prescription</Text>

                            <Switch
                                style={{ marginLeft: 10 }}
                                trackColor={{ false: '#767577', true: '#34eb40' }}
                                thumbColor={this.state.containsDrugs ? '#fff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => { this.toggleDrug() }}
                                value={this.state.containsDrugs}
                            />
                        </View>
                        {/* <View style={{ flexDirection: 'row' }}>
                         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                             <Text>Enter valid Times</Text>
                         </View>

                         <TextInput
                             value={this.state.validTimes}
                             selectionColor={themeColor}
                             keyboardType="numeric"
                             style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                             onChangeText={(text) => { this.changeValidTimes(text) }}

                         />
                     </View> */}

                    </View>
                    <TouchableOpacity
                        onPress={() => { this.props.changeFunction("delete", item, index) }}
                        style={{ position: "absolute", top: 10, right: 10, }}
                    >
                        <Entypo name="circle-with-cross" size={24} color="red" />
                    </TouchableOpacity>
                    {
                        this.Modal()
                    }
                </View>
            );
        }

      
      

       
        if (item.manual) {
            return (
               <View style={[styles.card4,{justifyContent:"space-around"}]}>
                    <View style={{ marginLeft: 20, marginTop:5}}>
                        <Text style={[styles.text, { color: "#000" }]}>Enter Name</Text>
                        <TextInput
                            value={this.state.name}
                            selectionColor={themeColor}
                            onChangeText={(name) => { this.changeName(name) }}
                            style={{ width: width * 0.7, height: 35, backgroundColor: "#fafafa", borderRadius: 15, padding: 10, marginTop: 10 }}
                        />
                    </View>
                    {this.state.name.length > 0 && <View style={{ marginTop:10,marginLeft:20}}>
                        <Text style={[styles.text, { color: "#000" }]}>Select Type</Text>
                        <View style={{ marginTop: 10 }}>
                            {/* <DropDownPicker
                                items={types}
                                containerStyle={{ height: 40, width: width * 0.4 }}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa', width: width * 0.4 }}
                                //   onChangeItem={item => this.setState({
                                //       selectedType: item.value
                                //   })}
                                onChangeItem={(item) => {
                                    this.changeType(item)
                                }}
                            /> */}
                            <TouchableOpacity style={{height:height*0.05,width:width*0.5,alignItems:"center",justifyContent:"space-around",backgroundColor:inputColor,flexDirection:"row",alignSelf:"center"}}
                             onPress={()=>{
                                 this.setState({typeModal:true})
                             }}
                            >
                                   <View>
                                        <Text style={[styles.text,{color:"#000"}]}>Select Type</Text>
                                   </View>
                                    <View>
                                         <FontAwesome name="angle-down" size={24} color="black" />      
                                    </View>
                            </TouchableOpacity>
                        </View>
                    </View>}

                    <TouchableOpacity
                        onPress={() => { this.props.changeFunction("delete", item, index) }}
                        style={{ position: "absolute", top: 10, right: 10, }}
                    >
                        <Entypo name="circle-with-cross" size={24} color="red" />
                    </TouchableOpacity>
                    {
                        this.changeTypeModal(types)
                    }
                </View>
            )
        }
        return (
                <View
                    key={index}
                    style={[styles.card2,{...((this.props.medicinesGiven.length+this.props.index+1)==(this.props.errorIndex+1)&&styles.errorStyle)}]}
                >
                    <View style={{ flex: 1,flexDirection:"row",alignItems:"center",marginLeft:10}}>
                        <Text style={[styles.text, { fontWeight: "bold",fontSize: height*0.023 }]}> {this.props.medicinesGiven.length+this.props.index+1} . {item.title || item.medicine}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center", justifyContent: "space-between" ,marginTop:10}}>
                       <View style={{ flexDirection: "row" }}>
                            <Text style={[styles.text,{fontSize:height*0.02}]}>Category :</Text>
                            <Text style={[styles.text, {fontSize:height*0.02}]}> {item.type}</Text>
                        </View>
                    </View>
                 
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                        <View style={{flexDirection:"row"}}>
                        <View style={{alignItems:'center',justifyContent:"center"}}>
                              <Text>Enter  Qty</Text>
                        </View>
                       
                          <TextInput
                              value={item.total_qty.toString()}
                              keyboardType={"numeric"}
                              selectionColor ={themeColor}
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                              onChangeText={(text) => {this.changeQty(text)}}
                          />
                    </View>

                   
                    </View>
                          <TouchableOpacity style={{height:height*0.05,width:width*0.5,backgroundColor:inputColor,alignItems:"center",justifyContent:"space-around",flexDirection:"row",alignSelf:"center",marginTop:10}}
                             onPress={()=>{
                                 this.setState({showModal:true})
                             }}
                            >   
                                  <View>
                                         <Text style={[styles.text]}>{this?.state?.selectedDiagnosis||"Select Diagnosis"}</Text>
                                  </View>
                                  <View>
                                      <Entypo name="chevron-small-down" size={20} color="black" />
                                  </View>
                            </TouchableOpacity>
                    <View style={{ margin: 10 }}>
                        <Text>Comments:</Text>
                        <TextInput
                            selectionColor={themeColor}
                            multiline={true}
                            onChangeText={(comment) => { this.changeComment(comment) }}
                            style={{ height: height * 0.07, width: "100%", backgroundColor: "#eee", borderRadius: 10, marginTop: 10, textAlignVertical: "top", padding: 5 }}
                            value={this.state.comment}
                        />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", flex: 0.2, marginVertical: 20 }}>
                        {<View style={{ flexDirection: "row" }}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>Do not issue without prescription</Text>

                            <Switch
                                style={{ marginLeft: 10 }}
                                trackColor={{ false: '#767577', true: '#34eb40' }}
                                thumbColor={this.state.containsDrugs ? '#fff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => { this.toggleDrug() }}
                                value={this.state.containsDrugs}
                            />
                        </View>}
                        {/* <View style={{ flexDirection: 'row' }}>
                          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                              <Text>Enter valid Times</Text>
                          </View>

                          <TextInput
                              value={this.state.validTimes}
                              selectionColor={themeColor}
                              keyboardType="numeric"
                              style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                              onChangeText={(text) => { this.changeValidTimes(text) }}

                          />
                      </View> */}

                    </View>
                    <TouchableOpacity
                        onPress={() => { this.props.changeFunction("delete", item, index) }}
                        style={{ position: "absolute", top: 10, right: 10, }}
                    >
                        <Entypo name="circle-with-cross" size={24} color="red" />
                    </TouchableOpacity>
                    {
                        this.Modal()
                    }
                    
                </View>
            )
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily,

    },
    elevation: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 4.65,

        elevation: 8,
    },
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        minHeight: height * 0.5,
        borderRadius: 10,

    },
    card2: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        minHeight: height * 0.4,
        borderRadius: 10,

    },
    card3: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.25,
        borderRadius: 10,

    },
    card4: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        minHeight: height * 0.25,
        borderRadius: 10,

    },
    errorStyle:{
        borderColor:"orange",borderWidth:3
    }
})