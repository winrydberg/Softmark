import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Footer,
  Button,
  Item,
  Input,
  Icon,
} from 'native-base';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, userKey, tokenKey} from '../constants';
import Loader from 'react-native-modal-loader';
import axios from '../config/axios';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showMessage, hideMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setUser} from '../actions/user';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      email: null,
      phoneno: null,
      password: null,
      confirmpassword: null,
      isLoading: false,
    };
  }

  /**
   * store user data in async storage
   * @param {*} data
   * @param {*} key
   */
  storeData = async (data, key) => {
    try {
      const jsonUser = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonUser);
      return true;
    } catch (e) {
      alert(e.message);
      return false;
    }
  };

  registerUser = () => {
    this.setState({
      isLoading: true,
    });
    axios
      .post('/register', {
        name: this.state.name,
        email: this.state.email,
        phone_number: this.state.phoneno,
        password: this.state.password,
        confirmpassword: this.state.confirmpassword,
      })
      .then((response) => {
        this.setState({
          isLoading: false,
        });

        console.log(response.data);

        if (response.data.status == 'success') {
          showMessage({
            message: 'You have successfully registered on softmark.',
            type: 'success',
            icon: 'info',
          });

          this.props.actions.setUser(response.data.user);

          this.storeData(response.data.user, userKey);
          this.storeData(response.data.token, tokenKey);
          if (this.props.continueas == 'LOGINUSER') {
            this.props.navigation.pop(2);
            this.props.navigation.push('DeliveryDetails', {
              continueas: 'LOGINUSER',
            });
          } else {
            setTimeout(
              function () {
                this.props.navigation.goBack();
              }.bind(this),
              1500,
            );
          }
        } else {
          showMessage({
            message: response.data.message,
            type: 'danger',
            icon: 'info',
          });
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        // alert(error.message);
        alert(JSON.stringify(error.message));
        showMessage({
          message: 'Oops something went wrong. Please try again later..',
          type: 'danger',
          icon: 'info',
        });
      });
  };

  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Ionicons
                name="chevron-back-circle-outline"
                size={30}
                color="#fff"
              />
            </Button>
          </Left>
          <Body>
            <Title>Create Account</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Loader loading={this.state.isLoading} color={primaryColor} />
          <View>
            <View style={styles.inputItem}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="person-circle-outline"
                />
                <Input
                  placeholder="Name"
                  onChangeText={(name) => {
                    this.setState({
                      name: name,
                    });
                  }}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="mail-outline"
                />
                <Input
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={(email) => {
                    this.setState({
                      email: email,
                    });
                  }}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="ios-call-outline"
                />
                <Input
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  onChangeText={(phoneno) => {
                    this.setState({
                      phoneno: phoneno,
                    });
                  }}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="lock-closed-outline"
                />
                <Input
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(value) => {
                    this.setState({
                      password: value,
                    });
                  }}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Item regular>
                <Ionicons
                  size={25}
                  color="gray"
                  style={{padding: 3}}
                  name="lock-closed-outline"
                />
                <Input
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  onChangeText={(value) => {
                    this.setState({
                      confirmpassword: value,
                    });
                  }}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Button block onPress={() => this.registerUser()}>
                <Text style={{color: '#fff'}}>REGISTER</Text>
              </Button>
            </View>

            <View style={styles.newAccountSection}>
              <Text>Have an account?</Text>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.btnNewAccountText}>SIGN IN</Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  inputItem: {
    marginTop: 20,
    // marginBottom: 20,
  },
  btnNewAccountText: {
    fontWeight: 'bold',
    color: primaryColor,
  },
  newAccountSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
});

const ActionCreators = Object.assign({}, {setUser});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(Register);
