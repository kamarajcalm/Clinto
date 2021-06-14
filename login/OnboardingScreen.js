import * as React from 'react';
import { Animated, Text, Image, View, StyleSheet, Dimensions, FlatList, StatusBar} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import settings from '../AppSettings';
const url = settings.url;
import authAxios from '../api/authAxios';
const { width, height } = Dimensions.get('screen');
import { Appearance, useColorScheme } from 'react-native-appearance';
// https://www.flaticon.com/packs/retro-wave
// inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
// https://twitter.com/mironcatalin/status/1321180191935373312

const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF'];
const DATA = [
    {
        "key": "3571572",
        "title": url,
        "description": "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
        "image": "https://image.freepik.com/free-vector/online-doctor-concept_52683-37585.jpg"
    },
    {
        "key": "3571747",
        "title": "Automated ",
        "description": "Use the optical SAS system, then you can navigate the auxiliary alarm!",
        "image": "https://image.freepik.com/free-vector/flat-hand-drawn-patient-taking-medical-examination_52683-56269.jpg"
    },
    {
        "key": "3571680",
        "title": "Inverse attitude-oriented system engine",
        "description": "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
        "image": "https://image.freepik.com/free-vector/teamwork-doctors-medical-brainstorm_153097-9.jpg"
    },
    {
        "key": "3571603",
        "title": "Monitored global data-warehouse",
        "description": "We need to program the open-source IB interface!",
        "image": "https://image.freepik.com/free-vector/hand-drawn-patient-taking-medical-examination_52683-57017.jpg"
    }
]
const Square =({scrollX})=>{
    const YOLO = Animated.modulo(
        Animated.divide(
        Animated.modulo(scrollX,width),
        new Animated.Value(width)
    ),
    1
    );
   const rotate =YOLO.interpolate({
       inputRange:[0,0.5,1],
       outputRange:['35deg','0deg','35deg']
   })
   const translateX = YOLO.interpolate({
       inputRange:[0,0.5,1],
       outputRange:[0,-height,0],
   })
  return<Animated.View 
    style={{
        width:height,
        height:height,
        backgroundColor:"#fff",
        borderRadius:86,
        position:"absolute",
        top:-height*0.6,
        left:-height*0.3,
        transform:[
            {
                rotate,
            },{
                translateX
            }
        ]
    }}
  />
}
const Backdrop =({scrollX})=>{
    const backgroundColor = scrollX.interpolate({
         inputRange:bgs.map((_,i)=>i*width),
         outputRange:bgs.map((bg)=>bg),
    })
  return <Animated.View 
     style={[StyleSheet.absoluteFillObject,{
         backgroundColor
     }]}
  
  />
}
const Indicator =({scrollX})=>{
  
    return <View style={{position:'absolute',bottom:80,flexDirection:"row"}}>
        {
            DATA.map((_,i)=>{
                const inputRange =[(i-1)*width,i*width,(i+1)*width];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8,1.4,0.8],
                    extrapolate:'clamp'
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 0.9, 0.6],
                    extrapolate: 'clamp'
                })
                return <Animated.View 
                  key={`indicator-${i}`}
                  style={{
                      height:10,
                      width:10,
                      borderRadius:5,
                      backgroundColor:"#fff",
                      opacity,
                      margin:10,
                      transform:[{
                           scale,
                      }]
                  }}
                >
                    
                </Animated.View>
            })
        }
    </View>
}
export default function OnboardingScreen(props) {

  
       const scrollX = React.useRef(new Animated.Value(0)).current;
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"#fff"}/>
          <Backdrop scrollX={scrollX} />
            <Square scrollX={scrollX}/>
          <Animated.FlatList 
            data={DATA}
            horizontal
            scrollEventThrottle={32}
            onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],
                {useNativeDriver:false}
                
                )}
                pagingEnabled
            contentContainerStyle={{paddingBottom:100}}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={({item,index})=>{
                  return(
                      <View style={{width,alignItems:'center',padding:20}}>
                          <View style={{flex:0.7,justifyContent:"center"}}>
                              <Image
                                  source={{ uri: item.image }}
                                  style={{ width: width / 2, height: height / 2, resizeMode: "contain" }}

                              />
                          </View>
                          <View style={{flex:0.3}}>
                               <Text style={{fontWeight:'800',fontSize:28,marginBottom:10,color:"#fff"}}>{item.title}</Text>
                               <Text style={{fontWeight:'300',color:"#fff"}}>{item.description}</Text>
                               {<View style={{alignItems:'center',justifyContent:'center',marginTop:30}}>
                                   <TouchableOpacity style={{height:height*0.05,width:width*0.3,alignItems:'center',justifyContent:"center",backgroundColor:"#fff",borderRadius:10}}
                                     onPress={()=>{props.navigation.navigate('LoginScreen')}}
                                   >
                                        <Text style={{color:"#333"}}>Login</Text>
                                   </TouchableOpacity>
                               </View>

                               }
                          </View> 
                      </View>
                  )
            }}
          />
          <Indicator scrollX={scrollX}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});