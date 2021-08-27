import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import settings from '../AppSettings';
const url = settings.url
const inputColor = settings.TextInput
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
const { height, width } = Dimensions.get("window");
import axios from 'axios';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
export default class MedicinesForVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicines: [],
      offset: 0,
      next: true,
      cancelToken: undefined,
      refreshing: false,
    
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
  getMedicines = async () => {

    const api = `${url}/api/prescription/medicines/?unverified=true&limit=10&offset=${this.state.offset}`
    const data = await HttpsClient.get(api)
    console.log(api)
    if (data.type == "success") {
      this.setState({ medicines: this.state.medicines.concat(data.data.results), refreshing: false })
      if (data.data.next == null) {
        this.setState({ next: false })
      }
    } else {
      this.setState({ refreshing: false })
    }
  }
  componentDidMount() {
    this.getMedicines()
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({ offset: 0, next: true, medicines: [] }, () => {
        this.getMedicines()
      })

    });
  }
  loadMore = () => {
    if (this.state.next) {
      this.setState({ offset: this.state.offset + 10 }, () => {
        this.getMedicines()
      })
    }
  }
  verifyItem = async(item,index)=>{
    const api = `${url}/api/prescription/medicines/${item.id}/?unverified=true`
    let sendData ={
      is_verified:true
    }
    let del = await HttpsClient.patch(api,sendData)
    if (del.type == "success") {
      let duplicate = this.state.medicines
      duplicate.splice(index, 1)
      this.setState({ medicines: duplicate })
      return this.showSimpleMessage("Verified Succesfully", "green", "success")

    }
  }
  createAlert = (item, index) => {
    Alert.alert(
      "Do you want to verify?",
      `${item.title}`,
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => { this.verifyItem(item, index) } }
      ]
    );

  }
  header = () => {
    return (
      <View style={{}}>
       
        <View style={{ flexDirection: "row", marginTop: 10, flex: 1 }}>
          <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>#</Text>
          </View>
          <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Name</Text>
          </View>
          <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Verify</Text>
          </View>
        </View>
     
      </View>
    )
  }
  renderFooter = () => {
    if (this.state.next) {
      return (
        <ActivityIndicator size={"large"} color={"#fff"} />
      )
    } else {
      return null
    }
  }
  Refresh = () => {
    this.setState({ offset: 0, next: true, medicines: [], refreshing: true }, () => {
      this.getMedicines()
    })
  }
  render() {
    return (
      <FlatList
        onRefresh={() => { this.Refresh() }}
        refreshing={this.state.refreshing}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListHeaderComponent={this.header()}
        onEndReached={() => { this.loadMore() }}
        onEndReachedThreshold={0.1}
        data={this.state.medicines}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={this.renderFooter()}
        renderItem={({ item, index }) => {

          return (
            <View style={{ flexDirection: "row", marginTop: 10, flex: 1 }}>
              <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{index + 1}</Text>
              </View>
              <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{item.title}</Text>
              </View>
              <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}
                onPress={()=>{
                  this.createAlert(item,index)
                }}
              >
                <Text style={[styles.text, { fontSize: height * 0.022 ,textDecorationLine:"underline"}]}>VERIFY</Text>
              </TouchableOpacity>
            
            </View>
          )
        }}
      />
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
  }

})