import React, {Component} from 'react';
import {View, Image, Text, Pressable} from 'react-native';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Button,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {baseIMGUrl} from '../constants';
import {setSelectedProduct} from '../actions/products';
import {addProductToCart} from '../actions/cart';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showMessage, hideMessage} from 'react-native-flash-message';

class BrandProduct extends Component {
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

  buyNow = (product) => {
    let {carts, actions} = this.props;
    if (carts.find((item) => item.id == product.id) == undefined) {
      actions.addProductToCart(product);
      this.props.navigation.navigate('Cart');
    } else {
      this.props.navigation.navigate('Cart');
    }
  };

  addToCart = (product) => {
    let {carts, actions} = this.props;
    if (carts.filter((item) => item.id == product.id).length == 0) {
      actions.addProductToCart(product);
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
  render() {
    return (
      <Pressable onPress={() => this.goToProductDetails(this.props.product)}>
        <Card style={{elevation: 0}}>
          <CardItem bordered>
            <Body style={{flexDirection: 'row'}}>
              <View>
                {/* <Image
                  style={{height: 100, width: 100}}
                  source={require('../assets/images/placeholder.png')}
                /> */}
                <Image
                  style={{height: 100, width: 100, resizeMode: 'cover'}}
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
                      backgroundColor: '#F0B577',
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
                  }}>
                  <Button
                    primary
                    small
                    block
                    style={{flex: 1, elevation: 0}}
                    onPress={() => this.buyNow(this.props.product)}>
                    <Text style={{color: '#FFF'}}>BUY NOW</Text>
                  </Button>
                  <Button
                    warning
                    small
                    block
                    onPress={() => this.addToCart(this.props.product)}
                    style={{flex: 1, marginLeft: 5, elevation: 0}}>
                    <Text style={{color: '#FFF'}}>ADD TO CART</Text>
                  </Button>
                  {/* <Button
                  small
                  full
                  style={{flex: 1, marginLeft: 10, elevation: 0}}>
                  <Text>ADD TO CART</Text>
                </Button> */}
                </View>
              </View>
            </Body>
          </CardItem>
          <CardItem bordered>
            <Ionicons color="orange" name="heart-outline" size={25} />
          </CardItem>
        </Card>
      </Pressable>
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

export default connect(mapStateToProps, mapDispatchToProps)(BrandProduct);
