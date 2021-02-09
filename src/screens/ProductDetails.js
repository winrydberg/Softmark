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
  Fab,
  Icon,
} from 'native-base';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Image,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Share,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  primaryColor,
  primaryBg,
  phoneNumber,
  baseIMGUrl,
  primaryDark,
  baseURL,
  playstoreURL,
} from '../constants';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {Linking} from 'react-native';
import {addProductToCart} from '../actions/cart';
import {bindActionCreators} from 'redux';
import {WebView} from 'react-native-webview';
import {SliderBox} from 'react-native-image-slider-box';
import {showMessage, hideMessage} from 'react-native-flash-message';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {Easing} from 'react-native-reanimated';
import {storeCartInStorage, saveToRecentlyViewed} from '../utils';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {ThemeConsumer, Divider} from 'react-native-elements';
import Loader from 'react-native-modal-loader';
import WebViewAutoHeight from '../components/WebViewAutoHeight';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      productImages: [
        'https://www.softmark.com.gh/storage/products/images/1977/conversions/DL5-image.jpg',
        'https://www.softmark.com.gh/storage/products/images/1981/conversions/DL4-image.jpg',
      ],
      product: {
        uri:
          'https://www.softmark.com.gh/storage/products/images/162/conversions/1-%285%29-image.jpg',
        name: 'Round Neck Short Sleeve T-Shirt - Pieces - Multicolor',
        price: '100',
        oldprice: '150',
        description:
          'This wardrobe is sturdy and durable and will meet your long term storage needs. It has a zipper that makes it easy to open or close closet to keep your items away from dust. it comes with a free 4-tier dustproof shoe rack which is designed to provide a great storage solution for your collection of favorite footwear. This innovative, lightweight space saving shoe rack can be placed in a cubby closet, mudroom or busy entryway to keep shoes or accessories accessible. Each shelf holds up to 3 or 4 pairs of full-size shoes.',
      },
      loading: false,
    };

    this.addToCart = this.addToCart.bind(this);
    this.buyNow = this.buyNow.bind(this);
  }

  componentDidMount() {
    let pImages = [];
    this.props.product.media.forEach((element) => {
      pImages.push(
        // baseIMGUrl +
        //   '/' +
        //   element.id +
        //   '/conversions/' +
        //   this.formatImage(element.file_name),

        // baseIMGUrl +
        //   '/' +
        //   this.props.product.media[0].id +
        //   '/conversions/' +
        //   this.urlencode(
        //     this.formatImage(this.props.product.media[0].file_name),
        //   ),

        // baseIMGUrl +
        //   '/' +
        //   this.props.product.media[0].id +
        //   '/' +
        //   this.props.product.media[0].file_name,
        baseIMGUrl + '/' + element.id + '/' + element.file_name,
      );
    });

    this.setState({
      productImages: pImages,
    });
    saveToRecentlyViewed(this.props.product.id);
  }

  urlencode = (str) => {
    str = (str + '').toString();
    let img = encodeURIComponent(str)
      .replace('!', '%21')
      .replace("'", '%27')
      .replace('(', '%28')
      .replace(')', '%29')
      .replace('*', '%2A')
      .replace('%20', '+');
    return img;
  };

  async addToCart() {
    this.setState({
      loading: true,
    });
    let {carts, actions} = this.props;
    // alert(JSON.stringify(carts))
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

  async buyNow() {
    let {carts, actions} = this.props;
    // alert(JSON.stringify(carts))
    if (carts.find((item) => item.id == this.props.product.id) == undefined) {
      actions.addProductToCart(this.props.product);
      storeCartInStorage(this.props.carts);
      this.props.navigation.navigate('Cart');
    } else {
      this.props.navigation.navigate('Cart');
    }
  }

  callNumber = () => {
    let phoneNo = phoneNumber;
    if (Platform.OS !== 'android') {
      phoneNo = `telprompt:${phoneNo}`;
    } else {
      phoneNo = `tel:${phoneNumber}`;
    }
    Linking.canOpenURL(phoneNo)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNo);
        }
      })
      .catch((err) => {});
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

  loadCartIndicator = () => {
    if (this.props.carts.length > 0) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginRight: 10,
            padding: 10,
          }}
          onPress={() => this.props.navigation.navigate('Cart')}>
          <Button transparent>
            <Ionicons size={25} color="#fff" name="cart" />
          </Button>
          <View
            style={{
              backgroundColor: 'red',
              width: 18,
              height: 18,
              borderRadius: 9,
              position: 'absolute',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginLeft: 45,
            }}>
            <Text style={{color: '#fff', fontSize: 10}}>
              {this.props.carts.length}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return;
      // return (
      //   <TouchableOpacity
      //     onPress={() => this.props.navigation.navigate('Cart')}>
      //     <Button transparent>
      //       <Ionicons size={25} color="#fff" name="cart" />
      //     </Button>
      //   </TouchableOpacity>
      // );
    }
  };

  calculateDiscount = (newprice, oldprice) => {
    var diff = oldprice - newprice;
    var percentage = (diff / oldprice) * 100;
    return Math.round(percentage);
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Softmark | Hello, follow the link below to view the product. ' +
          baseURL +
          'products/' +
          this.props.product.slug +
          '\n \n You can also download Softmark Mobile App here: \n' +
          playstoreURL,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
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
            <Title>Details</Title>
          </Body>
          <Right>{this.loadCartIndicator()}</Right>
        </Header>
        <Content contentContainerStyle={styles.mainContainer}>
          <Loader loading={this.state.loading} color={primaryColor} />
          <ScrollView>
            <View style={styles.productImages}>
              <View style={styles.imgContainer}>
                <SliderBox
                  images={this.state.productImages}
                  sliderBoxHeight={'100%'}
                  onCurrentImagePressed={(index) =>
                    console.warn(`image ${index} pressed`)
                  }
                  dotColor="orange"
                  inactiveDotColor="#90A4AE"
                  parentWidth={Dimensions.get('window').width}
                  ImageComponentStyle={{
                    borderRadius: 5,
                    width: '90%',
                    alignSelf: 'center',
                  }}
                  imageLoadingColor="#2196F3"
                  autoplay
                  circleLoop
                  resizeMethod={'resize'}
                  resizeMode={'contain'}
                  paginationBoxStyle={{
                    position: 'absolute', //relative
                    bottom: 0,
                    padding: 0,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    paddingVertical: 2,
                  }}
                  dotStyle={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginHorizontal: 0,
                    padding: 0,
                    margin: 0,
                    backgroundColor: 'rgba(128, 128, 128, 0.92)',
                  }}
                />
                {/* <Image
                  style={styles.imageStyle}
                  source={{
                    uri:
                      baseIMGUrl +
                      '/' +
                      this.props.product.media[0].id +
                      '/conversions/' +
                      this.formatImage(this.props.product.media[0].file_name),
                  }}
                /> */}
              </View>
            </View>
            <View style={styles.productInfo}>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: 'brown',
                  width: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                  paddingTop: 2,
                  paddingBottom: 2,
                  marginLeft: 10,
                }}>
                <Text style={{fontSize: 11, color: '#fff', fontWeight: '300'}}>
                  Official Store
                </Text>
              </View>
              <View style={styles.productNameContainer}>
                <Text style={styles.productnameStyle}>
                  {this.props.product.title}
                </Text>
              </View>

              <View style={{marginLeft: 10, marginBottom: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', color: 'gray'}}>
                    COLOUR:
                  </Text>
                  <Text>
                    {' '}
                    {this.props.product.main_colour != null
                      ? this.props.product.main_colour.name
                      : 'N/A'}
                  </Text>
                </View>
              </View>

              <Divider />

              <View style={{marginLeft: 10, paddingTop: 10, paddingBottom: 10}}>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  GH₵ {this.props.product.pricing[0].sale_price}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: 'gray',
                      fontWeight: 'bold',
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
                      paddingRight: 5,
                      borderRadius: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
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
              </View>

              {/* <View style={{margin: 10}}>
                <View style={styles.brandContainer}>
                  <Text>Brand: </Text>
                  <Text style={styles.brandType}> White Label</Text>
                </View>
                <View style={styles.brandContainer}>
                  <Text>Availability: </Text>
                  <Text style={styles.brandType}> In Stock</Text>
                </View>
              </View> */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: 10,
                }}>
                <View>
                  <View>
                    <Rating
                      type="star"
                      ratingCount={5}
                      startingValue={4}
                      count={5}
                      isDisabled={true}
                      imageSize={18}
                      readonly={true}
                      // showRating
                      color="orange"
                      onFinishRating={() => {}}
                    />
                  </View>
                  <View>
                    <Text style={{color: 'gray', fontSize: 10}}>Ratings</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={{marginLeft: 10, marginRight: 10}}
                    onPress={() => this.onShare()}>
                    <Ionicons
                      name="share-social-outline"
                      color="orange"
                      size={25}
                    />
                  </Pressable>
                  <Pressable style={{marginLeft: 10, marginRight: 10}}>
                    <Ionicons name="heart-outline" color="orange" size={25} />
                  </Pressable>
                </View>
              </View>

              <View style={{height: 10, backgroundColor: primaryBg}}></View>

              <View contentContainerStyle={styles.descriptionContainer}>
                <Text style={styles.descTitle}>DESCSRIPTION</Text>
                {/* < contentContainerStyle={{flexGrow: 1}}> */}

                <WebViewAutoHeight
                  html={
                    this.props.product.description +
                    this.props.product.highlights
                  }
                />

                {/* <WebView
                  style={{
                    // height: 500,
                    flex: 1,
                  }}
                  scrollEnabled={true}
                  panGestureEnabled={false}
                  automaticallyAdjustContentInsets={true}
                  // scrollEnabled={true}
                  source={{
                    html:
                      `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-size: 80%; word-wrap: break-word; overflow-wrap: break-word; color: gray }
                    </style>
                      </head><body>` +
                      this.props.product.description +
                      this.props.product.highlights +
                      `</body></html>`,
                  }}
                /> */}
                {/* </> */}

                {/* <WebView
                  style={{height: 100, fontSize: 20}}
                  scrollEnabled={true}
                  source={{
                    html:
                      '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>' +
                      +'</body></html>',
                  }}
                /> */}
              </View>

              {/* <Text>hhiii</Text> */}
            </View>
          </ScrollView>

          {/* <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: primaryDark}}
            position="bottomRight"
            onPress={() => this.setState({active: !this.state.active})}>
            <Icon name="share" />
            <Button style={{backgroundColor: '#34A34F'}}>
              <Ionicons name="share-social-outline" size={20} color="#FFF" />
            </Button>
            <Button style={{backgroundColor: '#3B5998'}}>
              <Ionicons name="heart-outline" size={20} color="#FFF" />
            </Button>
          </Fab> */}
        </Content>
        <Footer style={styles.footerCart}>
          {/* <View style={{width: '15%'}}> */}
          <Pressable
            style={{
              width: '20%',
              height: '100%',
              backgroundColor: 'orange',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.callNumber()}>
            <Ionicons color="#FFF" name="ios-call-outline" size={25} />
          </Pressable>
          {/* </View> */}
          {/* <View style={{width: '30%', marginLeft: 5}}> */}
          <Pressable
            style={{
              width: '30%',
              // marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: '#95E389',
            }}
            onPress={() => this.buyNow(this.props.product)}>
            <Text style={{color: 'green'}}>BUY NOW</Text>
          </Pressable>
          {/* </View> */}
          {/* <View style={{width: '50%', marginLeft: 5}}> */}
          <Pressable
            style={{
              width: '50%',
              // marginLeft: 5,
              backgroundColor: primaryColor,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            onPress={this.addToCart}>
            <Text style={{color: '#FFF'}}>ADD TO CART</Text>
          </Pressable>
          {/* </View> */}
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: primaryBg,
    flex: 1,
  },
  productImages: {
    height: Dimensions.get('window').height / 2.5,
    // backgroundColor: 'gray',
  },
  imgContainer: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 10,
    padding: 10,
    alignContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    flex: 1,
    // height: Dimensions.get('window').height / 2,
    margin: 10,
  },
  productInfo: {
    backgroundColor: '#fff',
    //   height: Dimensions.get('window').height / 4,
    flexGrow: 1,
  },
  productNameContainer: {
    padding: 10,
  },
  productnameStyle: {
    fontSize: 18,
    // fontWeight: 'bold',
    // color: 'gray',
  },
  brandContainer: {
    flexDirection: 'row',
  },
  brandType: {
    color: 'pink',
  },
  descriptionContainer: {
    // flex: 1,
    margin: 10,
  },
  descTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  footerCart: {
    // flex: 1,
    flexDirection: 'row',
    // justifyContent: 'sp',
    backgroundColor: '#fff',
    // alignItems: 'center',
    // elevation: 0,
  },
});

const mapStateToProps = (state) => ({
  product: state.products.selectedProduct,
  carts: state.carts.cart,
});

const ActionCreators = Object.assign({}, {addProductToCart});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
