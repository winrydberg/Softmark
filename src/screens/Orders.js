import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Button,
  Accordion,
  Icon,
} from 'native-base';
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {primaryColor, orderKey, tokenKey} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Loader from 'react-native-modal-loader';
import axios from '../config/axios';
import {Divider} from 'react-native-elements';

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: true,
      orders: [],
      loading: true,
      ordernos: [],
    };
  }

  async componentDidMount() {
    this.setState({
      isloading: false,
    });
    await this.getOrderNoFromStorage();
    this.loadOrdersFromServer();
  }

  loadOrdersFromServer = async () => {
    // alert(this.state.ordernos);
    const token = JSON.parse(await AsyncStorage.getItem(tokenKey));
    // config.headers.Authorization;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios
      .post('/my-orders', {
        ordernos: this.state.ordernos,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          // alert(response.data.orders.length);
          this.setState({
            orders: response.data.orders,
            loading: false,
          });
        } else {
          showMessage({
            message: response.data.message,
            type: 'danger',
            icon: 'info',
          });
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
        showMessage({
          message: error.message,
          type: 'dander',
          icon: 'info',
        });
      });
  };

  getOrderNoFromStorage = async () => {
    const value = JSON.parse(await AsyncStorage.getItem(orderKey));
    if (value !== null && Array.isArray(value)) {
      this.setState({
        ordernos: value,
      });
      // alert(JSON.stringify(value));
    } else {
      // alert('NULL');
    }
  };

  renderItem = () => {
    return (
      <View>
        <Text>Test</Text>
      </View>
    );
  };

  renderOrders = () => {
    if (this.state.loading == false) {
      if (this.state.orders.length <= 0) {
        return (
          <View
            style={{
              marginTop: Dimensions.get('window').height / 2.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="cart-outline" size={50} />
            <Text>You have no orders available now</Text>
          </View>
        );
      } else {
        return (
          // <SafeAreaView style={StyleSheet.container}>
          //   <FlatList
          //     data={this.state.orders}
          //     renderItem={this.renderItem}
          //     keyExtractor={(item) => item.id.toString()}
          //   />
          // </SafeAreaView>
          <Accordion
            dataArray={this.state.orders}
            animation={true}
            expanded={true}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
          />
        );
      }
    } else {
      return (
        <View
          style={{
            marginTop: Dimensions.get('window').height / 2.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      );
    }
  };

  renderIconsType = (statuses) => {
    var status = statuses[0].name;
    if (status == 'pending') {
      return (
        <View>
          <Ionicons
            name="ios-checkmark-circle-sharp"
            color="orange"
            size={30}
          />
        </View>
      );
    } else if (status == 'cancelled') {
      return (
        <View>
          <Ionicons name="ios-checkmark-circle-sharp" color="brown" size={30} />
        </View>
      );
    } else if (status == 'completed') {
      return (
        <View>
          <Ionicons name="ios-checkmark-circle-sharp" color="green" size={30} />
        </View>
      );
    } else {
      return (
        <View>
          <Ionicons name="ios-checkmark-circle-sharp" size={30} />
        </View>
      );
    }
  };

  _renderHeader = (item, expanded) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f6f6f6',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {this.renderIconsType(item.statuses)}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold'}}>ORDER NO - </Text>
              <Text style={{fontWeight: '600'}}> {item.order_no}</Text>
            </View>
            <View>
              <Text style={{color: 'gray'}}>Order Date: {item.created_at}</Text>
            </View>
          </View>
        </View>
        {expanded ? (
          <Icon
            style={{fontSize: 18}}
            color={primaryColor}
            name="remove-circle"
          />
        ) : (
          <Icon style={{fontSize: 18}} color={primaryColor} name="add-circle" />
        )}
      </View>
    );
  };

  _renderContent = (item) => {
    return (
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <View style={{flexDirection: 'row', padding: 10}}>
          <Text>Order Status: </Text>
          <Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
            {item.statuses[0].name}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 10}}>
          <Text>Order Items Amt: </Text>
          <Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
            GHC {Number(item.total_price)}
          </Text>
        </View>

        <View style={{flexDirection: 'row', padding: 10}}>
          <Text>Delivery Charge(s): </Text>
          <Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
            GHC {Number(item.charges)}
          </Text>
        </View>
        <Divider />

        <View style={{flexDirection: 'row', padding: 10}}>
          <Text>Total Amount Due: </Text>
          <Text style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
            GHC {Number(item.total_price) + Number(item.charges)}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* <Button primary small block>
            <Text>View Order Items</Text>
          </Button> */}
        </View>
      </View>
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
            <Title>My Orders</Title>
          </Body>
          <Right />
        </Header>
        <Content>{this.renderOrders()}</Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
