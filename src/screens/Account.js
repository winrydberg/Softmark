import React, {Component} from 'react';
import {Text, View, StyleSheet, StatusBar, Alert} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Item,
  Input,
  Content,
  Card,
  CardItem,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, userKey, tokenKey} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setUser} from '../actions/user';

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
    };
  }

  componentDidMount() {
    // this.getData();
    this.setState({
      user: this.props.user,
    });
  }
  /**
   * get user info from local storage
   */
  // getData = async () => {
  //   try {
  //     const value = JSON.parse(await AsyncStorage.getItem(userKey));
  //     if (value != null) {
  //       this.setState({
  //         user: value,
  //       });
  //     } else {
  //       alert(JSON.stringify(value));
  //     }
  //   } catch (e) {
  //     // error reading value
  //     alert(e.message);
  //   }
  // };

  showUserInfo = () => {
    if (this.props.user !== null) {
      return (
        <View>
          <Text style={styles.subText}>{this.props.user.email}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.subText}>Enter your account</Text>
        </View>
      );
    }
  };

  renderAuthScreens = () => {
    if (this.props.user == null) {
      return (
        <View>
          <Button
            block
            onPress={() => this.props.navigation.navigate('Login')}
            warning
            style={{width: '80%', alignSelf: 'flex-end'}}>
            <Text style={{color: '#fff'}}>LOGIN</Text>
          </Button>
        </View>
      );
    } else {
      return;
    }
  };

  logOutUser = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES, LOGOUT',
          onPress: async () => {
            this.props.actions.setUser(null);

            await AsyncStorage.removeItem(userKey);
            await AsyncStorage.removeItem(tokenKey);
            this.setState({
              user: null,
            });
          },
        },
      ],
      {cancelable: false},
    );
  };
  render() {
    return (
      <Container>
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Left>
            <FontAwesome name="user-circle-o" color="#fff" size={25} />
          </Left>
          <Body>
            <Title>Account</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <View>
            <Content>
              <View style={styles.accountSection}>
                <View>
                  <View>
                    <Text style={styles.welcomeText}>Welcome !</Text>
                  </View>
                  {this.showUserInfo()}
                </View>
                {this.renderAuthScreens()}
              </View>
              <Card style={styles.mb}>
                <CardItem header bordered>
                  <Text>MY ACCOUNT</Text>
                </CardItem>
                <CardItem
                  button
                  onPress={() => this.props.navigation.navigate('Orders')}>
                  <Left>
                    <Ionicons
                      active
                      name="file-tray-full-outline"
                      size={25}
                      style={{color: '#DD5044'}}
                    />
                    <Text> Orders</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
                {/* <CardItem>
                  <Left>
                    <Ionicons
                      active
                      name="folder-open-sharp"
                      size={25}
                      style={{color: '#3B579D'}}
                    />
                    <Text> Pending Reviews</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem> */}
                <CardItem
                  button
                  onPress={() => {
                    alert(
                      'Feature NOT available yet. Coming soon on version 1.0.1',
                    );
                  }}>
                  <Left>
                    <Ionicons
                      active
                      size={25}
                      name="save-outline"
                      style={{color: '#55ACEE'}}
                    />
                    <Text> Saved Items</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
                <CardItem
                  button
                  onPress={() =>
                    this.props.navigation.navigate('RecentlyViewed')
                  }>
                  <Left>
                    <Ionicons
                      size={25}
                      active
                      name="eye-outline"
                      style={{color: '#FF4500'}}
                    />
                    <Text> Recently Viewed</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem>
                {/* <CardItem>
                  <Left>
                    <Ionicons
                      size={25}
                      active
                      name="search"
                      style={{color: '#007BB6'}}
                    />
                    <Text> Recently Searched</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </CardItem> */}
              </Card>

              <Card style={{elevation: 0}}>
                <CardItem
                  button
                  onPress={() => this.props.navigation.navigate('AboutApp')}>
                  <Icon active name="logo-apple-appstore" size={25} />
                  <Text>About App</Text>
                </CardItem>
                <CardItem button onPress={() => this.logOutUser()}>
                  <Ionicons
                    style={{color: 'brown'}}
                    active
                    name="log-out-outline"
                    size={25}
                  />
                  <Text> Logout</Text>
                </CardItem>
              </Card>
            </Content>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  mb: {
    elevation: 0.1,
    borderWidth: 0,
    marginBottom: 15,
  },
  accountSection: {
    color: '#fff',
    backgroundColor: '#157ed2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#fff',
  },
  subText: {
    color: '#fff',
  },
});

const mapStateToProps = (state) => ({
  user: state.user.user,
});

const ActionCreators = Object.assign({}, {setUser});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
