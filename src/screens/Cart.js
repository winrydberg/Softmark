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
  CardItem,
  Card,
  ActionSheet,
  Item,
  Input,
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  StatusBar,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Product from '../components/Product';
import {primaryColor, primaryBg, primaryDark} from '../constants';
import CartProduct from '../components/CartProduct';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  removeItemFromCart,
  increaseCartProduct,
  updateCartTotalAmount,
  addProductToCart,
  setCart,
} from '../actions/cart';
import Loader from 'react-native-modal-loader';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {storeCartInStorage} from '../utils';

var BUTTONS = ['Option 0', 'Option 1', 'Option 2', 'Delete', 'Cancel'];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      totalAmount: 0,
      isloading: false,
    };

    this.calculateTotal();
  }

  componentDidMount() {
    // console.log(this.props.carts);
    // this.setState({
    //   cart: this.props.carts,
    // });
    // console.log(this.props.carts);
    this.calculateTotal();
  }

  orderNow = () => {
    this.setState({
      isloading: true,
    });
    ActionSheet.hide();
  };

  addToCart = async (product) => {
    let {carts, actions} = this.props;
    // alert(JSON.stringify(carts))
    if (carts.find((item) => item.id == product.id) == undefined) {
      await actions.addProductToCart(product);
      storeCartInStorage(this.props.carts);
      this.calculateTotal();
      showMessage({
        message: 'Product added to cart successfully',
        type: 'success',
        icon: 'info',
        position: 'bottom',
      });
    } else {
      showMessage({
        message: 'Product already in cart',
        type: 'danger',
        icon: 'info',
        position: 'bottom',
      });
    }
  };

  calculateTotal = () => {
    let total = 0;
    this.props.carts.forEach((element) => {
      let subTotal = element.pricing[0].sale_price * element.total;
      total += subTotal;
    });
    this.props.actions.updateCartTotalAmount(total);
  };

  handleOnRemoveFromCart = () => {
    let total = 0;
    this.props.carts.forEach((element) => {
      let subTotal = element.pricing[0].sale_price * element.total;
      total += subTotal;
    });
    this.props.actions.updateCartTotalAmount(total);
    storeCartInStorage(this.props.carts);
  };

  renderCartArea = () => {
    // console.log(this.props.recentviews);
    if (this.props.carts.length == 0) {
      return (
        <View>
          <View>{this.emptyCart()}</View>
          <View>{this.renderRecentlyViewed()}</View>
          <View>{this.justForYou()}</View>
        </View>
      );
    } else {
      return this.renderCartItems();
    }
  };

  emptyCart = () => {
    return (
      <View style={styles.upperSection}>
        <View>
          <Ionicons name="cart-outline" color={primaryDark} size={100} />
        </View>
        <View>
          <Text>You have no items in the cart</Text>
        </View>
        <View style={{width: '90%', marginTop: 20}}>
          <Button
            block
            onPress={() => this.props.navigation.goBack()}
            style={{elevation: 0}}>
            <Text style={{color: '#fff'}}>CONTINUE SHOPPING</Text>
          </Button>
        </View>
      </View>
    );
  };

  emptyCartItems = () => {
    Alert.alert(
      'Empty Cart',
      'Are you sure you want to empty cart now?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.actions.setCart([]);
          },
        },
      ],
      {cancelable: false},
    );
  };

  renderRecentlyViewed = () => {
    if (this.props.recentviews.length != 0) {
      return (
        <View style={[styles.emptyCartStyle, {paddingBottom: 20}]}>
          <View></View>
          <View style={styles.bottomSection}>
            <View style={styles.productMain}>
              <View style={styles.titleContainer}>
                <Text style={styles.titleStyle}>RECENTLY VIEWED</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal
                  data={this.props.recentviews.reverse()}
                  renderItem={(item) => {
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Product
                          product={item.item}
                          navigation={this.props.navigation}
                        />
                        {/* <Pressable
                          small
                          block
                          style={{marginRight: 5}}
                          onPress={() => this.addToCart(item.item)}>
                          <Text style={{color: '#FFF'}}>ADD TO CART</Text>
                        </Pressable> */}
                      </View>
                    );
                  }}
                  keyExtractor={(item) => JSON.stringify(item.id)}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: 'row',
                  }}
                />
              </SafeAreaView>
            </View>
          </View>
        </View>
      );
    } else {
      return;
    }
  };

  justForYou = () => {
    return (
      <View
        style={[
          styles.emptyCartStyle,
          {marginTop: 80, marginBottom: 10, paddingBottom: 20},
        ]}>
        <View></View>
        <View style={styles.bottomSection}>
          <View style={styles.productMain}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleStyle}>JUST FOR YOU</Text>
            </View>
            <SafeAreaView>
              <FlatList
                horizontal
                data={this.props.recommendations.reverse()}
                renderItem={(item) => {
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}>
                      <Product
                        product={item.item}
                        navigation={this.props.navigation}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item) => JSON.stringify(item.id)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
              />
            </SafeAreaView>
          </View>
        </View>
      </View>
    );
  };

  /**
   * ==========================================================================================
   * RENDER CART ITEMS
   * ==========================================================================================
   */
  renderCartItems = () => {
    return (
      <View>
        <SafeAreaView>
          <FlatList
            data={this.props.carts}
            renderItem={(item) => this.renderProduct(item)}
            keyExtractor={(item) => JSON.stringify(item.id)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </SafeAreaView>
        {this.totalCartAmount()}

        <View>{this.justForYou()}</View>
      </View>
    );
  };

  renderProduct = ({item}) => {
    // console.log(product);
    return (
      <CartProduct
        product={item}
        navigation={this.props.navigation}
        onRemoveItem={this.handleOnRemoveFromCart}
      />
    );
  };

  showOrderButton = () => {
    if (this.props.user != null) {
      return (
        <Button success full block>
          <Text>ORDER NOW</Text>
        </Button>
      );
    } else {
      return;
    }
  };

  orderLoadingIndicator = () => {
    if (this.state.isloading) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text>Sending Order... Please wait.</Text>
        </View>
      );
    } else {
      return;
    }
  };

  orderAs = () => {
    if (this.props.user != null) {
      return (
        <View style={{width: '100%'}}>
          <Button
            primary
            full
            block
            style={{elevation: 0}}
            onPress={() => {
              ActionSheet.hide();

              this.props.navigation.navigate('DeliveryDetails', {
                continueas: 'LOGINUSER',
              });
            }}
            disabled={this.state.isloading}>
            <Text style={{color: '#FFF', textTransform: 'uppercase'}}>
              CONTINUE AS {this.props.user.name}
            </Text>
          </Button>
          <Text style={{color: 'brown', marginTop: 100}}>
            You can logout to continue as guest
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{width: '100%', alignItems: 'center'}}>
          <Button
            success
            full
            block
            style={{elevation: 0}}
            onPress={() => {
              ActionSheet.hide();
              this.props.navigation.navigate('DeliveryDetails', {
                continueas: 'GUEST',
              });
            }}
            disabled={this.state.isloading}>
            <Text style={{color: '#FFF'}}>CONTINUE AS GUEST</Text>
          </Button>

          <View style={{marginBottom: 10, marginTop: 10}}>
            <Text>OR</Text>
          </View>
          <Button
            primary
            full
            block
            style={{elevation: 0}}
            onPress={() => {
              ActionSheet.hide();
              this.props.navigation.navigate('Login', {
                continueas: 'LOGINUSER',
              });
            }}
            disabled={this.state.isloading}>
            <Text style={{color: '#FFF'}}>LOGIN TO CONTINUE</Text>
          </Button>
        </View>
      );
    }
  };
  completeOrder = () => {
    // if (this.props.user == null) {
    ActionSheet.show(
      {
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: (
          <View
            style={{
              height: Dimensions.get('window').height - 100,
              flex: 1,
            }}>
            <Text style={{fontWeight: 'bold', marginBottom: 30}}> </Text>
            {/* <View> */}
            <ScrollView
              contentContainerStyle={{
                elevation: 0,
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <Text style={{flex: 1, fontSize: 16}}>Total Cart Amount:</Text>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  GH₵ : {this.props.totalAmount}
                </Text>
              </View>

              {/* <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Ionicons
                  name="information-circle-outline"
                  size={30}
                  color="brown"
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: 'brown',
                    fontWeight: 'bold',
                  }}>
                  NOTE: Delivery fee NOT included
                </Text>
              </View> */}

              {this.orderAs()}

              {/* {this.orderLoadingIndicator()} */}
              {/* </View> */}
            </ScrollView>
          </View>
        ),
      },
      (buttonIndex) => {
        this.setState({clicked: BUTTONS[buttonIndex]});
      },
    );
    // } else {
    //   this.props.navigation.navigate('Login');
    // }
  };

  totalCartAmount = () => {
    return (
      <Card style={styles.totalcartStyle}>
        <CardItem header>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <Text style={{alignItems: 'flex-start'}}>Total</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                alignItems: 'flex-end',
              }}>
              GH₵ {this.props.totalAmount}
            </Text>
          </View>
        </CardItem>
        <CardItem>
          <Body>
            <Button
              block
              style={{backgroundColor: 'orange'}}
              // onPress={() => this.props.navigation.navigate('CompleteOrder')}
              onPress={() => this.completeOrder()}>
              <Text style={{color: '#fff'}}>CHECK OUT</Text>
            </Button>
          </Body>
        </CardItem>
      </Card>
    );
  };
  render() {
    return (
      <Container style={styles.mainContainer}>
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
            <Title>My Cart</Title>
          </Body>
          <Right>
            <Pressable onPress={this.emptyCartItems}>
              <Text style={{color: '#FFF'}}>Empty Cart</Text>
            </Pressable>
          </Right>
        </Header>
        <Content contentContainerStyle={styles.mainContainer}>
          <Loader loading={this.state.isloading} color={primaryColor} />
          {this.renderCartArea()}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: primaryBg,
  },
  emptyCartStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  upperSection: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
  },
  bottomSection: {
    // height: Dimensions.get('window').height / 2,
  },
  totalcartStyle: {
    elevation: 0,
  },
  titleStyle: {
    marginLeft: 10,
  },
  productMain: {
    padding: 5,
    flex: 1,
  },
  titleContainer: {
    paddingBottom: 10,
    paddingTop: 10,
  },
});

const mapStateToProps = (state) => ({
  carts: state.carts.cart,
  totalAmount: state.carts.totalAmount,
  featured: state.products.featured,
  user: state.user.user,
  recentviews: state.products.recentlyviewed,
  recommendations: state.products.recommendations,
});

const ActionCreators = Object.assign(
  {},
  {removeItemFromCart, updateCartTotalAmount, addProductToCart, setCart},
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
