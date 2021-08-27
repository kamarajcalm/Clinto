import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions, TextInput, StyleSheet, TouchableOpacity ,SafeAreaView,ScrollView} from 'react-native';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import HttpsClient from '../api/HttpsClient';
import settings from '../AppSettings';
const url = settings.url
const inputColor = settings.TextInput
const themeColor = settings.themeColor
const fontFamily = settings.fontFamily
const { height, width } = Dimensions.get("window")
import DropDownPicker from 'react-native-dropdown-picker';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import moment from 'moment';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
 class PriceVerification extends Component {

    constructor(props) {
      
        super(props);
        this.state = {
         medicines: [],
      offset: 0,
      next: true,
      cancelToken: undefined,
      refreshing: false,
    }
  }
    loadMore = () => {
    if (this.state.next) {
      this.setState({ offset: this.state.offset + 10 }, () => {
        this.getMedicines()
      })
    }
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

    const api = `${url}/api/prescription/medicines/?priceverified=aa&limit=10&offset=${this.state.offset}`
    console.log(api)
    const data = await HttpsClient.get(api)
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
            <Text style={[styles.text, { color: "#000", fontSize: height * 0.022 }]}>Price</Text>
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
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                            {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.2, alignItems: "center", justifyContent: 'center' }}
                                onPress={() => { this.props.navigation.goBack() }}
                            >
                                <Ionicons name="chevron-back-circle" size={30} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Price Verification</Text>
                            </View>
                            <View style={{ flex: 0.2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }}
                            
                            >
                            
                            </View>
                        </View>
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
                            <TouchableOpacity style={{ flexDirection: "row", marginTop: 10, flex: 1 }} 
                              onPress={() => { this.props.navigation.navigate('AddMedicines',{item,verify:true})}}
                            >
                              <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{index + 1}</Text>
                              </View>
                              <View style={{ flex: 0.6, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { fontSize: height * 0.022 }]}>{item.title}</Text>
                              </View>
                              <View style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}
                              
                              >
                                <Text style={[styles.text, { fontSize: height * 0.022 ,}]}>{item.pricechange}</Text>
                              </View>
                            
                            </TouchableOpacity>
                          )
                        }}
                     />        
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
    card: {
        backgroundColor: "#fff",
        elevation: 6,
        margin: 20,
        height: height * 0.3
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
        user:state.selectedUser
    }
}
export default connect(mapStateToProps, { selectTheme })(PriceVerification);