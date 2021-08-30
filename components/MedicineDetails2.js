import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Switch, TextInput } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import settings from '../AppSettings'
const fontFamily = settings.fontFamily
const themeColor =settings.themeColor
const {height,width} = Dimensions.get("window");
const inputColor = settings.TextInput;
import DropDownPicker from 'react-native-dropdown-picker';
export default class MedicineDetails2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
        qty: this.props.item.total_qty.toString()||"",
        comment: this.props.item.command||"",
        diagnosis: [],
         selectedDiagnosis: null
    };
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

    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.diagonsis != this.props.diagonsis) {
            this.getDiagnosis()
        }

    }
  render() {
      const {index,item} =this.props
    return (
        <View
            key={index}
            style={[styles.card, { flex: 1 }]}
        >
            <View style={{ alignItems: 'center', justifyContent: "center", flex: 0.2 }}>
                <Text style={[styles.text, { fontWeight: "bold", fontSize: 20 }]}>{item.title}</Text>
            </View>
            <View style={{ flexDirection: "row", marginHorizontal: 10, alignItems: "center", flex: 0.2 }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.text]}>Category :</Text>
                    <Text style={[styles.text, {}]}> {item.type}</Text>
                </View>


            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", flex: 0.2 }}>


                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                        <Text>Enter Qty</Text>
                    </View>

                    <TextInput
                        keyboardType={"numeric"}
                        selectionColor={themeColor}
                        style={{ height: 35, width: 50, backgroundColor: '#eee', borderRadius: 5, marginLeft: 5, paddingLeft: 5 }}
                        value={this.state.qty}
                        onChangeText={(text) => { this.changeQty(text) }}
                    />
                </View>
            </View>
                  <View style={{ marginLeft: 10, alignItems: "center", marginTop: 10 }}>
                        <DropDownPicker
                            placeholder={"select diagnosis"}
                            items={this.state.diagnosis}
                            defaultValue={this.state.selectedDiagnosis}
                            containerStyle={{ height: 40, width: width * 0.5 }}
                            style={{ backgroundColor: inputColor }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: inputColor, width: width * 0.5 }}
                            onChangeItem={(item) => { this.changeDiagnosis(item.value) }}

                        />
                    </View>
            <View style={{ margin: 10, flex: 0.6, }}>
                <Text>Comments:</Text>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <TextInput
                        selectionColor={themeColor}
                        multiline={true}
                        onChangeText={(comment) => { this.changeComment(comment) }}
                        style={{ height: "70%", width: "100%", backgroundColor: "#eee", borderRadius: 10, textAlignVertical: "top", padding: 5 }}
                        value={this.state.comment}
                    />
                </View>

            </View>
            {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", flex: 0.2, marginVertical: 20 }}>
                {<View style={{ flexDirection: "row" }}>
                    <Text style={[styles.text, { fontWeight: 'bold' }]}>Contains Drugs</Text>

                    <Switch
                        style={{ marginLeft: 10 }}
                        trackColor={{ false: '#767577', true: '#34eb40' }}
                        thumbColor={this.state.containsDrugs ? '#fff' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => { this.toggleDrug() }}
                        value={this.state.containsDrugs}
                    />
                </View>}
                <View style={{ flexDirection: 'row' }}>
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
                </View>

            </View> */}
            <TouchableOpacity
                onPress={() => { this.props.changeFunction("delete", item, index) }}
                style={{ position: "absolute", top: 10, right: 10, }}
            >
                <Entypo name="circle-with-cross" size={24} color="red" />
            </TouchableOpacity>

        </View>
    );
  }
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 10,
        height: height * 0.3,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },
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
})