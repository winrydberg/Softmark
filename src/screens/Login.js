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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from 'react-native-modal-loader';
import axios from '../config/axios';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setUser} from '../actions/user';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoading: false,
      userInfo: {},
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

  getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name,  first_name, last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          this.setState({userInfo: result});
          console.log('result:', result);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginUser = () => {
    this.setState({
      isLoading: true,
    });
    axios
      .post('/login', {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        this.setState({
          isLoading: false,
        });
        // alert(JSON.stringify(response.data));
        if (response.data.status == 'success') {
          showMessage({
            message: 'You  have logged in successfully',
            type: 'success',
            icon: 'info',
          });
          // alert(JSON.stringify(response.data.user));
          this.props.actions.setUser(response.data.user);

          this.storeData(response.data.user, userKey);
          this.storeData(response.data.token, tokenKey);
          if (this.props.continueas == 'LOGINUSER') {
            this.props.navigation.pop(1);
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
        alert(JSON.stringify(response.data));
        showMessage({
          message: 'Oops something went wrong. Please try again later..',
          type: 'danger',
          icon: 'info',
        });
      });
  };

  registerNow = () => {
    this.props.navigation.navigate('Register', {
      continueas: this.props.continueas,
    });
  };

  fbLogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          console.log(result);
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
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
            <Title>Login</Title>
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
                  name="mail-outline"
                />
                <Input
                  placeholder="Email Address"
                  keyboardType="email-address"
                  onChangeText={(value) => this.setState({email: value})}
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
                  onChangeText={(value) => this.setState({password: value})}
                />
              </Item>
            </View>
            <View style={styles.inputItem}>
              <Button
                block
                style={{backgroundColor: 'orange'}}
                onPress={() => this.loginUser()}>
                <Text style={{color: '#fff'}}>LOGIN</Text>
              </Button>
            </View>

            {/* <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text> OR </Text>
            </View> */}

            {/* <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text>
                {this.state.userInfo.first_name != null
                  ? this.state.userInfo.toString()
                  : 'No Info'}
              </Text>
            </View> */}

            {/* <View style={{width: '100%'}}>
              <LoginButton
                onLoginFinished={(error, result) => {
                  if (error) {
                    console.log('login has error: ' + result.error);
                  } else if (result.isCancelled) {
                    console.log('login is cancelled.');
                  } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                      console.log(data);
                      // const accessToken = data.accessToken.toString();
                      // this.getInfoFromToken(accessToken);
                    });
                  }
                }}
                onLogoutFinished={() => console.log('logout.')}
              />
           
            </View> */}

            {/* <View>
              <LoginButton
                publishPermissions={['email']}
                onLoginFinished={(error, result) => {
                  if (error) {
                    alert('Login failed with error: ' + error.message);
                  } else if (result.isCancelled) {
                    alert('Login was cancelled');
                  } else {
                    alert(
                      'Login was successful with permissions: ' +
                        result.grantedPermissions,
                    );
                  }
                }}
                onLogoutFinished={() => alert('User logged out')}
              />
            </View> */}

            <View style={styles.newAccountSection}>
              <Text>New on softmark?</Text>
              <Button transparent onPress={() => this.registerNow()}>
                <Text style={styles.btnNewAccountText}>CREATE AN ACCOUNT</Text>
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

// const mapStateToProps = (state) => ({
//   user: state.user.user,
// });

const ActionCreators = Object.assign({}, {setUser});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
