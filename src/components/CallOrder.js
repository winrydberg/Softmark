import React, {Component} from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  Linking,
  Modal,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, phoneNumber, primaryDark} from '../constants';
import * as Animatable from 'react-native-animatable';
import VideoTutorial from '../screens/VideoTutorial';
import Video from 'react-native-video';
export default class CallOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      isloading: true,
    };
  }
  callNumber = () => {
    let phoneNo = phoneNumber;
    if (Platform.OS !== 'android') {
      phoneNo = `telprompt:${phoneNo}`;
    } else {
      phoneNo = `tel:${phoneNumber}`;
    }
    Linking.canOpenURL(phoneNo)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNo);
        }
      })
      .catch((err) => {});
  };

  showHowToModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  showLoader = () => {
    if (this.state.isloading) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={{color: '#FFF'}}>Loading Video... Please wait...</Text>
        </View>
      );
    } else {
      return;
    }
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Pressable
          onPress={this.callNumber}
          style={{
            padding: 8,
            // backgroundColor: '#95E389',
            // justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
            marginRight: 5,
            //   width: '100%',
            flex: 1,
            borderRadius: 5,
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'orange',
          }}>
          <Animatable.View
            animation="bounceIn"
            easing="ease-out"
            iterationCount="infinite">
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'orange',
              }}>
              <Ionicons
                name="call"
                size={15}
                style={{color: 'white', fontWeight: 'bold'}}
              />
            </View>
          </Animatable.View>
          <Text
            style={{
              color: '#FFF',
              marginLeft: 10,
              color: 'orange',
              //   fontWeight: '300',
              fontSize: 12,
            }}>
            Call to Order
          </Text>
        </Pressable>

        <Pressable
          onPress={this.showHowToModal}
          style={{
            padding: 8,
            // justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
            marginRight: 5,
            //   width: '100%',
            flex: 1,
            borderRadius: 5,
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: primaryColor,
          }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FFF',
            }}>
            {/* <Ionicons
              name="help-circle-outline"
              size={15}
              style={{color: 'green', fontWeight: 'bold'}}
            /> */}
            <Animatable.View
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite">
              <Image
                style={{height: 25, width: 25}}
                source={require('../assets/images/info.png')}
              />
            </Animatable.View>
          </View>
          <Text style={{fontSize: 12}}>How to order from app</Text>
        </Pressable>

        <Modal
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setState({
              modalVisible: false,
            });
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {this.showLoader()}
              <Video
                source={{
                  uri: 'https://www.softmark.com.gh/storage/tutor.mp4',
                }} // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref;
                }} // Store reference
                resizeMode={'contain'}
                onLoad={() =>
                  this.setState({
                    isloading: false,
                  })
                }
                onBuffer={this.onBuffer} // Callback when remote video is buffering
                onError={this.videoError} // Callback when video cannot be loaded
                style={styles.backgroundVideo}
              />

              <Pressable
                onPress={() =>
                  this.setState({
                    modalVisible: false,
                    isloading: true,
                  })
                }
                style={{
                  position: 'absolute',
                  backgroundColor: primaryColor,
                  bottom: -20,
                  width: '100%',
                  height: 50,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Ionicons name="close" color="#fff" size={30} />
                <Text style={{color: '#FFF'}}>CLOSE VIDEO TUTORIAL</Text>
              </Pressable>

              {/* <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  //   this.setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight> */}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // paddingTop: 20,
  },
  modalView: {
    margin: 20,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 150,
    backgroundColor: primaryDark,

    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 20,
    left: 0,
    bottom: 20,
    right: 0,
  },
});
