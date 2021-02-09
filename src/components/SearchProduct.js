import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Button,
} from 'native-base';
import {Image, View, Text, Pressable} from 'react-native';
import {baseIMGUrl, primaryColor, primaryBg} from '../constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedProduct} from '../actions/products';
import {addProductToCart} from '../actions/cart';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from 'react-native-modal-loader';

class SearchProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.buyNow = this.buyNow.bind(this);
  }
  async addToCart() {
    this.setState({
      loading: true,
    });
    let {carts, actions} = this.props;

    if (carts.filter((item) => item.id == this.props.product.id).length == 0) {
      actions.addProductToCart(this.props.product);
      this.setState({
        loading: false,
      });
      showMessage({
        message: 'Product added to cart successfully',
        type: 'success',
        icon: 'info',
        position: 'bottom',
      });
    } else {
      this.setState({
        loading: false,
      });
      showMessage({
        message: 'Product already in cart',
        type: 'danger',
        icon: 'info',
        position: 'bottom',
      });
    }
  }

  async buyNow() {
    let {carts, actions} = this.props;

    if (carts.find((item) => item.id == this.props.product.id) == undefined) {
      await actions.addProductToCart(this.props.product);
      this.props.navigation.navigate('Cart');
    } else {
      this.props.navigation.navigate('Cart');
    }
  }

  calculateDiscount = (newprice, oldprice) => {
    var diff = oldprice - newprice;
    var percentage = (diff / oldprice) * 100;
    return Math.round(percentage);
  };

  goToDetails = () => {
    let {products, actions} = this.props;
    actions.setSelectedProduct(this.props.product);
    this.props.navigation.navigate('Details');
  };

  render() {
    return (
      <Pressable onPress={() => this.goToDetails()}>
        <Card style={{elevation: 0}}>
          <Loader loading={this.state.loading} color={primaryColor} />
          <CardItem>
            <Body>
              <View style={{flexDirection: 'row'}}>
                <View>
                  {/* <Image
                  style={{width: 120, height: 120}}
                  source={require('../assets/images/placeholder.png')}
                /> */}
                  <Image
                    style={{width: 100, height: 100, resizeMode: 'cover'}}
                    defaultSource={require('../assets/images/placeholder.png')}
                    source={{
                      uri:
                        baseIMGUrl +
                        '/' +
                        this.props.product.media[0].id +
                        '/' +
                        this.props.product.media[0].file_name,
                      // uri:
                      //   baseIMGUrl +
                      //   '/' +
                      //   this.props.product.media[0].id +
                      //   '/conversions/' +
                      //   this.urlencode(
                      //     this.formatImage(this.props.product.media[0].file_name),
                      //   ),
                    }}
                  />
                </View>
                <View style={{marginLeft: 10, flex: 1}}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold'}}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {this.props.product.title}
                  </Text>
                  <Text style={{marginTop: 5}}>
                    GHC {this.props.product.pricing[0].sale_price}
                  </Text>

                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: 'gray',
                        fontSize: 12,
                        marginBottom: 10,
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                      }}>
                      GHC {this.props.product.pricing[0].price}
                    </Text>
                    <View
                      style={{
                        // backgroundColor: '#F0B577',
                        paddingLeft: 5,
                        paddingRight: 5,
                        borderRadius: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#F0B577',
                          fontWeight: 'bold',
                        }}>
                        -
                        {this.calculateDiscount(
                          this.props.product.pricing[0].sale_price,
                          this.props.product.pricing[0].price,
                        )}
                        %
                      </Text>
                    </View>
                  </View>

                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{margin: 1, overflow: 'hidden', flex: 1}}>
                      <Pressable
                        style={{
                          elevation: 0,
                          flex: 1,
                          marginLeft: 5,
                          borderWidth: 1,
                          borderColor: primaryColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}
                        onPress={this.buyNow}>
                        <Text style={{color: primaryColor, fontSize: 10}}>
                          BUY NOW
                        </Text>
                      </Pressable>
                    </View>
                    <View style={{margin: 1, overflow: 'hidden', flex: 1}}>
                      <Pressable
                        android_ripple={{color: primaryBg}}
                        style={{
                          elevation: 0,
                          flex: 1,
                          marginLeft: 5,
                          backgroundColor: 'orange',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          height: 30,
                        }}
                        onPress={this.addToCart}>
                        <Ionicons name="cart-outline" color="white" />
                        <Text
                          style={{color: '#fff', fontSize: 10, marginLeft: 5}}>
                          ADD TO CART
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </Body>
          </CardItem>
        </Card>
      </Pressable>
    );
  }
}

const mapStateToProps = (state) => ({
  carts: state.carts.cart,
});

const ActionCreators = Object.assign(
  {},
  {setSelectedProduct, addProductToCart},
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchProduct);
