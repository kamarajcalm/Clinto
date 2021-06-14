import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, Image, StyleSheet, TouchableOpacity, AsyncStorage, SafeAreaView, ScrollView } from 'react-native';
import settings from '../AppSettings';
import axios from 'axios';
import Modal from 'react-native-modal';
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import { Ionicons, Entypo, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
const themeColor = settings.themeColor;
const fontFamily = settings.fontFamily;
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import ImageView from 'react-native-image-zoom-viewer';
// const images = [{
//     // Simplest usage.
//     url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

//     // width: number
//     // height: number
//     // Optional, if you know the image size, you can set the optimization performance

//     // You can pass props to <Image />.
//     props: {
//         // headers: ...
//     }
// },]
export default class ImageViewer extends Component {
    constructor(props) {
        let images = props.route.params.images||null
        let index = props.route.params.index
        let ind = 1
        if(images){
        
          let indexFind = images.find((i,idx)=>{
              if(index == i.index) {
                  ind =idx
                  return  idx
              }
          })
          console.log(indexFind,"ppppp")
        }
        super(props);
        this.state = {
            images,
           index:ind
        };
    }
    renderFooter =(item)=>{
     
        return(
            <View style={{position:"absolute",bottom:50,width,alignItems:"center",justifyContent:'center'}}>
                <Text style={[styles.text,{fontWeight:"bold"}]}>{this.state.images[item].message}</Text>
            </View>
        )
    }

    render() {
        return (
             <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                 
                    
                    <ImageView 
                      imageUrls={this.state.images} 
                      index={this.state.index} 
                      renderFooter={this.renderFooter}
                      enableSwipeDown={true}
                      onSwipeDown={()=>this.props.navigation.goBack()}
                    />
                    <View style={{position:"absolute",top:30,left:20}} >
                            <TouchableOpacity
                             onPress ={()=>{this.props.navigation.goBack()}}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                             </TouchableOpacity>
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
})