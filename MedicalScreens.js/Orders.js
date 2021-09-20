import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
import settings from '../AppSettings';
import medicine from '../components/Medicine';
import Medicine from '../components/Medicine';
import HttpsClient from '../api/HttpsClient';
import moment from 'moment';
import Requests from './Requests';
import History from './History';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
const { height, width } = Dimensions.get("window");
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;

const url = settings.url;
  const routes = [
            { key: 'Requests', title: 'Requests' },
            { key: 'Orders', title: 'Orders' },
           
        ];
 class Orders extends Component {
    constructor(props) {
        super(props);
       this.state = {
            routes,
            index: 0,
    
        };
    }
     renderScene = ({ route, }) => {
         switch (route.key) {

             case 'Requests':
                 return <Requests navigation={this.props.navigation} />
     
             case 'Orders':
                 return <History navigation={this.props.navigation} />
             default:
                 return null;
         }
     };
  render() {
     const { index, routes } = this.state
    return (
            <>
                <SafeAreaView style={styles.topSafeArea} />
                <SafeAreaView style={styles.bottomSafeArea}>
                      <View style={{flex:1}}>
                            <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            
                              <View style={{flex:0.7 }}>
                                <Text style={[styles.text, { color: '#fff', marginLeft: 20 ,fontWeight:'bold',fontSize:25}]}>Orders</Text>
                              </View>
                            <View style={{flex:0.3,alignItems:"center",justifyContent:'center'}}>
                              
                            </View>
                            </View>
                                  <TabView
                                      style={{ backgroundColor: "#ffffff" }}
                                      navigationState={{ index, routes }}
                                      renderScene={this.renderScene}
                                      onIndexChange={(index) => { this.setState({ index }) }}
                                      initialLayout={{ width }}
                                      renderTabBar={(props) =>
                                          <TabBar
                                              {...props}
                                              renderLabel={({ route, focused, color }) => (
                                                  <Text style={[styles.text,{ color: focused ? themeColor : 'gray',fontWeight:"bold" }]}>
                                                      {route.title}
                                                  </Text>
                                              )}
                                              style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                              labelStyle={{ fontWeight: "bold", color: "red" }}
                                              indicatorStyle={{ backgroundColor: themeColor, height: 2}}
                                          />
                                      }

                                 />
                      </View>
                </SafeAreaView>
                 </>
    )
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
    card: {

        backgroundColor: "#eeee",
        height: height * 0.1,
        marginHorizontal: 10,
        marginVertical: 3

    },
})
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,
        medical:state.selectedMedical
    }
}
export default connect(mapStateToProps, { selectTheme })(Orders);