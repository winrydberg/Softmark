import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Content} from 'native-base';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedProduct} from '../actions/products';
import {baseIMGUrl, primaryBg, primaryColor} from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {addProductToCart} from '../actions/cart';
import {storeCartInStorage} from '../utils';
import Loader from 'react-native-modal-loader';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    // console.log(this.props.product.media[0].responsive_images.thumb);
    this.addToCart = this.addToCart.bind(this);
  }

  goToProductDetails = (product) => {
    let {products, actions} = this.props;
    actions.setSelectedProduct(product);
    // console.log(
    //   baseIMGUrl +
    //     '/' +
    //     this.props.product.media[0].id +
    //     '/conversions/' +
    //     this.urlencode(this.formatImage(this.props.product.media[0].file_name)),
    // );
    this.props.navigation.navigate('Details');
    // this.props.navigation.navigate('WebviewProduct');
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
      <Pressable
        onPress={() => this.goToProductDetails(this.props.product)}
        style={styles.ItemContainer}>
        <Loader loading={this.state.loading} color={primaryColor} />
        {/* <View> */}
        <View>
          <Image
            style={styles.imageStyle}
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
        <View>
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={{color: '#637076', fontWeight: '100', fontSize: 12}}>
              {this.props.product.title}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={{fontWeight: 'bold', color: '#1d1d1d', fontSize: 14}}>
              GH₵ {this.props.product.pricing[0].sale_price}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: 'gray',
                fontSize: 12,
                marginLeft: 5,
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
              }}>
              GH₵ {this.props.product.pricing[0].price}
            </Text>
            <View
              style={{
                backgroundColor: 'orange',
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 2,
              }}>
              <Text style={{fontSize: 10, color: '#fff', fontWeight: 'bold'}}>
                -
                {this.calculateDiscount(
                  this.props.product.pricing[0].sale_price,
                  this.props.product.pricing[0].price,
                )}
                %
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={this.addToCart}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: primaryColor,
            marginTop: 10,
            marginBottom: 0,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 20,
            // backgroundColor: '#EAE4A8',
            flexDirection: 'row',
          }}>
          <Ionicons name="cart-outline" color={primaryColor} />
          <Text style={{fontSize: 10, color: primaryColor}}> ADD TO CART</Text>
        </Pressable>
        {/* </View> */}
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    height: 130,
    width: Dimensions.get('window').width / 2 - 50,
    resizeMode: 'cover',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  ItemContainer: {
    padding: 3,
    borderColor: '#e5e5e5',
    borderWidth: 0.5,
    marginRight: 15,
    borderRadius: 0,
    // backgroundColor: '#F194FF',
  },
  priceContainer: {
    margin: 3,
  },
  titleContainer: {
    width: Dimensions.get('window').width / 2 - 54,
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 3,
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
