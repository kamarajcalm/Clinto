import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions, TouchableOpacity, StyleSheet, FlatList, Image, SafeAreaView, AsyncStorage } from 'react-native';
import settings from '../AppSettings';
import { connect } from 'react-redux';
import { selectTheme } from '../actions';
const { height, width } = Dimensions.get("window");
import { Ionicons, AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
const fontFamily = settings.fontFamily;
const themeColor = settings.themeColor;
const screenHeight = Dimensions.get("screen").height
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import UniversalMedicines from './UniversalMedicines';
import MedicinesForVerification from './MedicinesForVerification';
const initialLayout = { width: Dimensions.get('window').width };
class MedicinesHome extends Component {
    constructor(props) {
        super(props);
        const routes = [
            { key: 'Universal', title: 'Universal' },
            { key: 'ForVerification', title: 'ForVerification' },
    

        ];
        this.state = {
            routes,
            index: 0,
            showModal: false
        };
    }
    getMedicines =()=>{

    }
    componentDidMount() {
        this.getMedicines()
    }

    indexChange = async (index) => {

        this.setState({ index })

    }
    renderScene = ({ route, }) => {
        switch (route.key) {

            case 'Universal':
                return <UniversalMedicines navigation={this.props.navigation} />
            case 'ForVerification':
                return <MedicinesForVerification navigation={this.props.navigation} />
           
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
                    <View style={{ flex: 1, backgroundColor: "#fff" }}>
                        <StatusBar backgroundColor={themeColor} />
                        {/* HEADERS */}
                        <View style={{ height: height * 0.1, backgroundColor: themeColor, borderBottomRightRadius: 20, borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: "center" }}>
                            <TouchableOpacity style={{ flex: 0.3, alignItems: "center", justifyContent: 'center' }}
                              onPress={()=>{this.props.navigation.goBack()}}
                            >
                            <Ionicons name="chevron-back-circle" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
                                <Text style={[styles.text, { color: '#fff', fontWeight: 'bold', fontSize: 18 }]}>Medicines</Text>
                            </View>
                           
                        </View>
                        {/* CHATS */}
                        <View style={{ flex: 1,}}>
                            <TabView
                                style={{ backgroundColor: "#ffffff" }}
                                navigationState={{ index, routes }}
                                renderScene={this.renderScene}
                                onIndexChange={(index) => { this.indexChange(index) }}
                                initialLayout={initialLayout}
                                renderTabBar={(props) =>
                                    <TabBar
                                        {...props}
                                        renderLabel={({ route, focused, color }) => (
                                            <Text style={{ color: focused ? themeColor : 'gray', margin: 8, fontWeight: "bold" }}>
                                                {route.title}
                                            </Text>
                                        )}
                                        style={{ backgroundColor: "#fff", height: 50, fontWeight: "bold", color: "red" }}
                                        labelStyle={{ fontWeight: "bold", color: "red" }}
                                        indicatorStyle={{ backgroundColor: themeColor, height: 5 }}
                                    />
                                }

                            />
                        </View>
                        <View>
                            <Modal
                                statusBarTranslucent ={true}
                                deviceHeight={screenHeight}
                                animationIn="slideInUp"
                                animationOut="slideOutDown"
                                isVisible={this.state.showModal}
                                onBackdropPress={() => { this.setState({ showModal: false }) }}
                            >
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ height: height * 0.3, width: width * 0.9, backgroundColor: "#fff", borderRadius: 20, alignItems: "center", justifyContent: "space-around" }}>
                                        <View>
                                            <Text style={[styles.text, { fontWeight: "bold", color: themeColor, fontSize: 20 }]}>Do you want to logout?</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-around", width, }}>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
                                                onPress={() => { this.logOut() }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: themeColor, height: height * 0.05, width: width * 0.2, alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                                                onPress={() => { this.setState({ showModal: false }) }}
                                            >
                                                <Text style={[styles.text, { color: "#fff" }]}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
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
const mapStateToProps = (state) => {

    return {
        theme: state.selectedTheme,

    }
}
export default connect(mapStateToProps, { selectTheme })(MedicinesHome);