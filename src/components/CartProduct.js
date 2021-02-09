import React, {Component} from 'react';
import {Image, View, Text, Dimensions, Alert} from 'react-native';
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
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  removeItemFromCart,
  increaseCartProduct,
  decreaseCartProduct,
  updateCartTotalAmount,
} from '../actions/cart';
import {showMessage, hideMessage} from 'react-native-flash-message';

class CartProduct extends Component {
  constructor(props) {
    super(props);
  }

  calculateTotal = () => {
    let total = 0;
    this.props.carts.forEach((element) => {
      let subTotal = element.pricing[0].sale_price * element.total;
      total += subTotal;
    });
    this.props.actions.updateCartTotalAmount(total);
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

  // removeFromStorage = async (product) => {
  //   let carts = JSON.parse(await AsyncStorage.getItem(cartKey));
  //   if (carts != null) {
  //     const index = carts.findIndex((item) => item.id === product.id);
  //     if (index > -1) {
  //       carts.splice(index, 1);
  //     }
  //   }
  // };

  removeProductFromCart = (product) => {
    Alert.alert(
      'REMOVE ITEM',
      'Are you sure you want to remove this item from cart',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES, REMOVE',
          onPress: async () => {
            await this.props.actions.removeItemFromCart(product);
            this.props.onRemoveItem();

            showMessage({
              message: 'Product removed from cart',
              type: 'danger',
              icon: 'info',
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  incrementItemInCart = (id) => {
    this.props.actions.increaseCartProduct(id);
    this.calculateTotal();
  };

  decrementItemInCart = (id, total, product) => {
    if (total <= 1) {
      Alert.alert(
        'Ooops Error',
        'This action will remove item from cart',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'SURE, CONTINUE',
            onPress: () => {
              this.props.actions.removeItemFromCart(product);
              this.props.onRemoveItem();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      this.props.actions.decreaseCartProduct(id);
      this.calculateTotal();
    }
  };

  render() {
    return (
      <Card style={{elevation: 0, margin: 16}}>
        <CardItem>
          <Body>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Image
                  style={{
                    width: Dimensions.get('window').width / 4,
                    height: Dimensions.get('window').width / 4,
                    resizeMode: 'contain',
                  }}
                  defaultSource={require('../assets/images/placeholder.png')}
                  source={{
                    // uri:
                    //   baseIMGUrl +
                    //   '/' +
                    //   this.props.product.media[0].id +
                    //   '/conversions/' +
                    //   this.urlencode(
                    //     this.formatImage(this.props.product.media[0].file_name),
                    //   ),
                    uri:
                      baseIMGUrl +
                      '/' +
                      this.props.product.media[0].id +
                      '/' +
                      this.props.product.media[0].file_name,
                  }}
                />
              </View>
              <View style={{marginLeft: 10}}>
                <View style={{flex: 1, width: '85%'}}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{fontWeight: 'bold', width: '60%', fontSize: 16}}>
                    {this.props.product.title}
                  </Text>
                  <Text style={{color: 'gray', marginTop: 5}}>
                    Unit Price: GH₵ {this.props.product.pricing[0].sale_price}
                  </Text>
                </View>
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <Text>Sub Total: </Text>
                  <Text>
                    GH₵
                    {this.props.product.pricing[0].sale_price *
                      this.props.product.total}
                  </Text>
                </View>
              </View>
            </View>
          </Body>
        </CardItem>
        <CardItem footer bordered>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{alignItems: 'flex-start', alignItems: 'center'}}>
              <Button
                block
                transparent
                small
                onPress={() => this.removeProductFromCart(this.props.product)}>
                <Ionicons color="red" name="ios-trash-outline" size={20} />
                <Text style={{color: 'red'}}>REMOVE</Text>
              </Button>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View>
                <Ionicons
                  onPress={() =>
                    this.decrementItemInCart(
                      this.props.product.id,
                      this.props.product.total,
                      this.props.product,
                    )
                  }
                  style={{paddingLeft: 10, paddingRight: 10}}
                  name="ios-remove-circle-outline"
                  color="orange"
                  size={25}
                />
              </View>
              <View>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {this.props.product.total}
                </Text>
              </View>
              <View>
                <Ionicons
                  onPress={() =>
                    this.incrementItemInCart(this.props.product.id)
                  }
                  style={{paddingLeft: 10, fontWeight: 'bold'}}
                  name="add-circle-outline"
                  color="orange"
                  size={25}
                />
              </View>
            </View>
          </View>
        </CardItem>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  carts: state.carts.cart,
  featured: state.products.featured,
});

const ActionCreators = Object.assign(
  {},
  {
    removeItemFromCart,
    increaseCartProduct,
    decreaseCartProduct,
    updateCartTotalAmount,
  },
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartProduct);
