import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const url = settings.url;
import { Modal, } from 'react-native-paper';
import HttpsClient from '../api/HttpsClient';

import { FontAwesome } from '@expo/vector-icons';
class MedicineItems extends Component {
    constructor(props) {
  
        super(props);
        this.state = {
         item:this.props.item
        };
    }

    componentDidMount() {

    }
 

    validate = ()=>{
     
            return (
                <TouchableOpacity style={[styles.button]} 
                  onPress ={()=>{this.props.addQuantity(this.state.item,this.props.index)}}
                
                >
                    <Text style={[styles.text, { color: "#fff" }]}>Add</Text>
                </TouchableOpacity>
            )
        

        
    
    }
    render() {
        const { item } = this.props
        return (
            <>
                <View style={{height:height*0.2,alignItems:'center',justifyContent:"space-around",padding: 20,}}>
                      <View>
                          <Text>{item.title}</Text>
                      </View>
                    <View style={{flexDirection:"row"}}>
                        <Text style={[styles.text,{textDecorationLine:"line-through"}]}>₹{item.maxretailprice}</Text>
                        <Text style={[styles.text,{marginLeft:10}]}>₹{item.shopprice}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={[styles.text, { fontWeight:"bold",fontSize:12 }]}>QTY:</Text>
                        <Text style={[styles.text, { marginLeft: 10 }]}>{item.quantity}</Text>
                    </View>
                      <View>
                          {
                              this.validate(item)
                          }
                      </View>
                </View>

            </>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontFamily
    },
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
    },
    button: {
        height: height * 0.05,
        width: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColor,
        borderRadius: 10,
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
export default connect(mapStateToProps, { selectTheme })(MedicineItems);