import React, {Component} from 'react';
import {View, Image, Text, Pressable, Button, Dimensions} from 'react-native';
import {Container, Header, Content, Card, CardItem, Body} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {baseIMGUrl, primaryColor, primaryBg} from '../constants';
import {setSelectedProduct} from '../actions/products';
import {addProductToCart} from '../actions/cart';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Loader from 'react-native-modal-loader';
import {storeCartInStorage} from '../utils';

class NewArrivalProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
    this.addToCart = this.addToCart.bind(this);
    this.buyNow = this.buyNow.bind(this);
  }
  goToProductDetails = (product) => {
    let {products, actions} = this.props;
    actions.setSelectedProduct(product);
    this.props.navigation.navigate('Details');
  };

  urlencode = (str) => {
    str = (str + '').toString();
    let img = encodeURIComponent(str)
      .replace('!', '%21')
      .replace("'", '%27')
      .replace('(', '%28')
      .replace(')', '%29')
      .replace('*', '%2A')
      .replace('%20', '+');
    // alert(img);
    return img;
  };

  formatImage = (image) => {
    let imgParts = image.split('.');
    if (imgParts.length > 2) {
      let fileName = '';
      for (var i = 0; i < imgParts.length - 1; i++) {
        if (i == 0) {
          fileName = imgParts[0];
        } else {
          fileName = fileName + '.' + imgParts[i];
        }
      }
      return fileName + '-image.jpg';
    } else {
      return imgParts[0] + '-image.jpg';
    }
  };

  calculateDiscount = (newprice, oldprice) => {
    var diff = oldprice - newprice;
    var percentage = (diff / oldprice) * 100;
    return Math.round(percentage);
  };

  async buyNow() {
    let {carts, actions} = this.props;
    if (carts.find((item) => item.id == this.props.product.id) == undefined) {
      actions.addProductToCart(this.props.product);
      this.props.navigation.navigate('Cart');
    } else {
      this.props.navigation.navigate('Cart');
    }
  }

  async addToCart() {
    this.setState({
      loading: true,
    });
    let {carts, actions} = this.props;
    if (carts.find((item) => item.id == this.props.product.id) == undefined) {
      await actions.addProductToCart(this.props.product);
      await storeCartInStorage(this.props.carts);
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
  render() {
    return (
      <View
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
          width: Dimensions.get('window').width - 50,
        }}>
        <Loader loading={this.state.loading} color={primaryColor} />
        <Card noShadow style={{elevation: 0, borderWidth: 0.0}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Image
                  style={{height: 110, width: 110, resizeMode: 'cover'}}
                  defaultSource={require('../assets/images/placeholder.png')}
                  source={{
                    uri:
                      baseIMGUrl +
                      '/' +
                      this.props.product.media[0].id +
                      '/' +
                      this.props.product.media[0].file_name,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  flex: 1,
                  marginTop: 10,
                  marginRight: 10,
                }}>
                <Text numberOfLines={1} ellipsizeMode="tail">
                  {this.props.product.title}
                </Text>
                <Text style={{fontWeight: 'bold'}}>
                  GH₵ {this.props.product.pricing[0].sale_price}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontWeight: '300',
                      color: 'gray',
                      textDecorationLine: 'line-through',
                      textDecorationStyle: 'solid',
                    }}>
                    GH₵ {this.props.product.pricing[0].price}
                  </Text>
                  <View
                    style={{
                      backgroundColor: 'orange',
                      paddingLeft: 5,
                      marginLeft: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: 5,
                      borderRadius: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#fff',
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

                <View
                  style={{
                    flex: 1,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 0,
                    bottom: 0,
                  }}>
                  {/* <Button
                    title=" BUY NOW"
                    style={{flex: 1, elevation: 0}}
                    onPress={() => this.buyNow(this.props.product)}></Button> */}

                  <Pressable
                    onPress={this.addToCart}
                    style={{
                      height: 30,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      //   backgroundColor: 'orange',
                      borderWidth: 1,
                      borderColor: 'orange',
                      borderRadius: 15,
                      marginLeft: 1,
                    }}>
                    <Text style={{color: 'orange', fontSize: 10}}>
                      ADD TO CART
                    </Text>
                  </Pressable>
                  {/* <Button
                  small
                  full
                  style={{flex: 1, marginLeft: 10, elevation: 0}}>
                  <Text>ADD TO CART</Text>
                </Button> */}
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.4,
              borderColor: '#E7E7E7',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flex: 1,
            }}>
            {/* <Ionicons color="orange" name="heart-outline" size={25} /> */}
            <View style={{flexDirection: 'row', flex: 1}}>
              <Pressable
                onPress={() => this.goToProductDetails(this.props.product)}
                style={{
                  flex: 1,
                  borderRightWidth: 0.5,
                  borderRightColor: '#E7E7E7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  borderBottomColor: 'orange',
                  borderBottomWidth: 4,
                }}>
                <Ionicons color="orange" name="eye" size={25} />
              </Pressable>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottomColor: primaryColor,
                  borderBottomWidth: 4,
                }}>
                <Ionicons color={primaryColor} name="heart-outline" size={25} />
              </View>
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  //   product: state.products.selectedProduct,
  carts: state.carts.cart,
});
const ActionCreators = Object.assign(
  {},
  {setSelectedProduct, addProductToCart},
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewArrivalProduct);
