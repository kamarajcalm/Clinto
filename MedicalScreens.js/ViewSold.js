import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
class ViewSold extends Component {
    constructor(props) {
        let item = props.route.params.item
        super(props);
        this.state = {
            item
        };
    }

    render() {
        return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                        <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                            onPress={() => { this.props.navigation.goBack() }}
                        >
                            <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}>Sold Details</Text>
                        </View>
                        <View style={{ flex: 0.2 }}>
                            <Text style={[styles.text, { color: "#fff", fontSize: 24, fontWeight: 'bold' }]}></Text>
                        </View>
                    </View>
                       
                    <ScrollView>
                        <View style={{marginHorizontal:20,marginTop:10}}>
                            <View>
                                <Text style={[styles.text,{color:"#000"}]}>Customer Name :</Text>
                            </View>
                            <View style={{marginTop:5,marginLeft:5}}>
                                <Text style={[styles.text]}>{this.state.item.contact_details}</Text>
                            </View>

                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text, { color: "#000" }]}>Customer Mobile :</Text>
                            </View>
                            <View style={{ marginTop: 5, marginLeft: 5 }}>
                                <Text style={[styles.text]}>{this.state.item.contact_no}</Text>
                            </View>

                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text, { color: "#000" }]}>Discount :</Text>
                            </View>
                            <View style={{ marginTop: 5, marginLeft: 5 }}>
                                <Text style={[styles.text]}>{this.state.item.discount}</Text>
                            </View>

                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text, { color: "#000" }]}>Amount :</Text>
                            </View>
                            <View style={{ marginTop: 5, marginLeft: 5 }}>
                                <Text style={[styles.text]}>{this.state.item.total}</Text>
                            </View>

                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                            <View>
                                <Text style={[styles.text, { color: "#000" }]}>Date :</Text>
                            </View>
                            <View style={{ marginTop: 5, marginLeft: 5 }}>
                                <Text style={[styles.text]}>{moment(this.state.item.created).format("DD-MM-YYYY")}</Text>
                            </View>

                        </View>
                        <View style={{ marginHorizontal: 20, marginTop: 10,alignItems:"center" }}>
                            <Text style={[styles.text,{fontSize:18}]}>Medicines</Text>
                        </View>
                        <View style={{flex:1,flexDirection:"row",marginTop:10}}>
                            <View style={{flex:0.1,alignItems:"center",justifyContent:"center"}}>
                               <Text style={[styles.text]}>#</Text>
                            </View>
                            <View style={{flex:0.3,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text]}>Name</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text]}>Type</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text]}>Quantity</Text>
                            </View>
                            <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text]}>Price</Text>
                            </View>
                        </View>
                        {
                            this.state.item.items.map((item,index)=>{
                                return(
                                    <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}
                                     key ={index}
                                    >
                                        <View style={{ flex: 0.1, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text]}>{index+1}</Text>
                                        </View>
                                        <View style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text]}>{item.medicineDetail.title}</Text>
                                        </View>
                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text]}>{item.medicineDetail.type}</Text>
                                        </View>
                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text]}>{item.quantity}</Text>
                                        </View>
                                        <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={[styles.text]}>{item.sold_total}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
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

    }
}
export default connect(mapStateToProps, { selectTheme })(ViewSold);