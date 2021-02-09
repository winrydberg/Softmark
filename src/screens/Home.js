import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
  Modal,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
  Badge,
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import HomeTopBar from '../components/HomeTopBar';
import MySeparator from '../components/MySeparator';
import Product from '../components/Product';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  primaryColor,
  primaryBg,
  primaryDark,
  userKey,
  cartKey,
  recentlyViewedKey,
  baseBannerURL,
} from '../constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setSelectedProduct} from '../actions/products';
import HomeCategory from '../components/HomeCategory';
import {setCategories} from '../actions/categories';
import {setBanners} from '../actions/banners';
import {setBrands, setBrandsFetched} from '../actions/brands';
import axios from '../config/axios';
import {
  setNewArrivals,
  setFeatured,
  setBestSeller,
  setLoading,
  setRecentlyViewed,
  setRecommendations,
} from '../actions/products';
import Loader from 'react-native-modal-loader';
import NetInfo from '@react-native-community/netinfo';
import {SliderBox} from 'react-native-image-slider-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewArrivalProduct from '../components/NewArrivalProduct';
import CallOrder from '../components/CallOrder';
import VideoTutorial from './VideoTutorial';

const icons = [
  {
    name: 'ios-home',
    bgColor: '#FF5733',
  },
  {
    name: 'football-outline',
    bgColor: '#5D1E57',
  },
  {
    name: 'shirt-outline',
    bgColor: '#16B35A',
  },
  {
    name: 'woman-outline',
    bgColor: '#EDBB99',
  },
  {
    name: 'ios-briefcase-outline',
    bgColor: '#157ed2',
  },

  //new
  {
    name: 'man-outline',
    bgColor: '#C70039',
  },
  {
    name: 'ios-woman-sharp',
    bgColor: '#EA219B',
  },
  {
    name: 'md-recording-sharp',
    bgColor: '#2C3F41',
  },
  {
    name: 'md-desktop-sharp',
    bgColor: '#0BBAC6',
  },
  {
    name: 'watch-sharp',
    bgColor: '#682DC6',
  },
  {
    name: 'md-disc-sharp',
    bgColor: '#268E5D',
  },
  {
    name: 'school',
    bgColor: '#6B3F04',
  },
  {
    name: 'car-outline',
    bgColor: '#E13D40',
  },
  {
    name: 'book-outline',
    bgColor: '#5D1E57',
  },
];

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: false,
      modalVisible: false,
      intloading: false,
      recentviewsids: [],
      //scrolling
      currentPosition: 0,
      scrolling: false,
      momentumScrolling: false,
    };
  }

  componentDidMount() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        this.setState({
          modalVisible: false,
        });
        // this.loadBrands();
        // this.startScroll();
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    });
  }

  getData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem(userKey));
      const cart = JSON.parse(await AsyncStorage.getItem(cartKey));
      const recentviews = await JSON.parse(
        await AsyncStorage.getItem(recentlyViewedKey),
      );

      if (recentviews != null && recentviews instanceof Array) {
        this.setState({
          recentviewsids: recentviews,
        });
      }
      if (cart != null && cart instanceof Array) {
        this.props.actions.setCart(cart);
      }
      if (value != null) {
        this.props.actions.setUser(value);
        // console.log(value);
      } else {
        // alert(JSON.stringify(value));
      }
    } catch (e) {
      // error reading value
      // alert(e.message);
    }
  };

  loadBrands = () => {
    axios
      .get('/get-brands')
      .then((response) => {
        if (response.data.status == 'success') {
          alert(JSON.stringify(response.data.brands));
          this.props.actions.setBrands(response.data.brands);
          this.props.actions.setBrandsFetched(true);
        } else {
          this.props.actions.setBrandsFetched(false);
        }
      })
      .catch((error) => {
        this.props.actions.setBrandsFetched(false);
      });
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
      return fileName + '-hero.jpg';
    } else {
      return imgParts[0] + '-hero.jpg';
    }
  };

  loadInitialData = async () => {
    await this.getData();
    let categoriesURI = '/get-categories';
    let bannerURI = '/get-banners';
    let indexURI = '/index';
    let recentViewsURI = '/recent-views';
    let recommendationURI = '/recommendations';

    const reqCategories = axios.get(categoriesURI);
    const reqBanners = axios.get(bannerURI);
    const reqIndex = axios.get(indexURI);
    const reqRecommendations = axios.get(recommendationURI);
    const reqRecentViews = axios.post(recentViewsURI, {
      ids: this.state.recentviewsids,
    });

    Promise.all([
      reqCategories,
      reqBanners,
      reqIndex,
      reqRecommendations,
      reqRecentViews,
    ])
      .then(
        ([
          respCategories,
          respBanners,
          respIndex,
          respRecommendations,
          respRecentViews,
        ]) => {
          this.setState({
            loading: false,
            modalVisible: false,
          });
          // alert(JSON.stringify(respBanners, respIndex));
          let {actions} = this.props;
          let sliders = [];
          for (var i = 0; i < respBanners.data.banners.length; i++) {
            sliders.push(
              baseBannerURL +
                '/' +
                respBanners.data.banners[i].media[0].id +
                '/conversions/' +
                this.urlencode(
                  this.formatImage(
                    respBanners.data.banners[i].media[0].file_name,
                  ),
                ),
            );
          }
          actions.setRecommendations(respRecommendations.data.recommendations);

          actions.setNewArrivals(respIndex.data.newarrivals);
          actions.setBestSeller(respIndex.data.bestsellers);
          actions.setFeatured(respIndex.data.featured);
          actions.setRecentlyViewed(respRecentViews.data.recentviews);
          actions.setBanners(sliders);

          actions.setLoading(false);

          actions.setCategories(respCategories.data.categories);
          SplashScreen.hide();
        },
      )
      .catch((error) => {
        alert(error.message);
        let {actions} = this.props;
        actions.setLoading(false);
      });
  };

  renderItem = ({item}) => {
    return <Product product={item} navigation={this.props.navigation} />;
  };

  renderNewArrival = ({item}) => {
    return (
      <NewArrivalProduct product={item} navigation={this.props.navigation} />
    );
  };

  showParentCategories = () => {
    let {categories} = this.props;
    // var items = categories.slice(0, 5);
    const NO_PER_SCREEN = 5;
    const itemWidth = Dimensions.get('window').width / NO_PER_SCREEN;
    var items = categories;
    return (
      <FlatList
        horizontal
        data={items}
        renderItem={({item, index}) => (
          <HomeCategory
            category={item}
            icons={icons[index]}
            navigation={this.props.navigation}
          />
        )}
        keyExtractor={(item) => JSON.stringify(item.id)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
        }}
      />
    );
  };

  loadCartIndicator = () => {
    if (this.props.cart.length > 0) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // marginRight: 10,
            padding: 15,
          }}
          onPress={() => this.props.navigation.navigate('Cart')}>
          {/* <Button transparent> */}
          <Ionicons size={25} color="#fff" name="cart" />
          {/* </Button> */}
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
              marginLeft: 35,
            }}>
            <Text style={{color: '#fff', fontSize: 10}}>
              {this.props.cart.length}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Cart')}>
          {/* <Button transparent> */}
          <Ionicons size={25} color="#fff" name="cart" />
          {/* </Button> */}
        </TouchableOpacity>
      );
    }
  };

  showModal = () => {
    if (this.state.modalVisible) {
      return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Ionicons name="md-wifi-sharp" size={100} />
                <Text style={styles.modalText}>NO INTERNET CONNECTION</Text>
                <Button
                  block
                  onPress={() => {
                    NetInfo.fetch().then((state) => {
                      // console.log('Connection type', state.type);

                      if (state.isConnected) {
                        this.setState({
                          intloading: true,
                        });

                        this.loadInitialData();
                        this.loadBrands();
                        // this.setState({
                        //   modalVisible: false,
                        // });
                      } else {
                        alert('An internet error occurred, please try again');
                        this.setState({
                          modalVisible: true,
                        });
                      }
                    });
                  }}>
                  <Text style={{color: '#fff'}}>TRY AGAIN</Text>
                </Button>

                {this.showInternetLoading()}
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
      return;
    }
  };

  showInternetLoading = () => {
    if (this.state.intloading) {
      return (
        <View>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text>Loading... Please wait...</Text>
        </View>
      );
    } else {
      return;
    }
  };

  showModalVideoTutorial = () => {
    return <VideoTutorial modalVisible={true} />;
  };

  showSignInLayer = () => {
    if (this.props.user != null) {
      return;
    } else {
      return (
        <View
          style={{
            padding: 10,
            position: 'absolute',
            width: Dimensions.get('window').width,
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            zIndex: 99999999999,
            alignSelf: 'flex-end',
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: '#FFF', flex: 3}}>
            Sign In to see personalized deals
          </Text>
          <Button
            small
            block
            light
            // bordered
            rounded
            style={{
              color: '#fff',
              flex: 1,
              backgroundColor: 'orange',
              elevation: 0,
            }}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={{color: '#FFF'}}>Sign In</Text>
          </Button>
        </View>
      );
    }
  };

  render() {
    let {
      featured,
      bestseller,
      newarrivals,
      banners,
      recommendations,
    } = this.props;
    return (
      <Container>
        {/* <StatusBar barStyle="dark-content" /> */}
        <Header noShadow style={{backgroundColor: primaryColor}}>
          <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
          <Left>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/logo.png')}
            />
          </Left>
          <Body></Body>
          <Right>{this.loadCartIndicator()}</Right>
        </Header>

        <View style={styles.identityHeader}>
          <Loader loading={this.state.loading} color={primaryColor} />

          <View style={{marginLeft: 10, marginRight: 10, marginBottom: 10}}>
            <Item
              rounded
              small
              style={{
                backgroundColor: '#fff',
                height: 40,
                borderColor: '#fff',
              }}>
              <Icon color="white" name="ios-search" />
              <Input
                placeholder="Search on softmark"
                style={{fontSize: 14}}
                onFocus={() => this.props.navigation.navigate('Search')}
              />
              {/* <FontAwesome
                size={20}
                style={{marginRight: 10}}
                name="shopping-bag"
              /> */}
            </Item>
          </View>
        </View>
        <ScrollView>
          {/* <HomeTopBar banners={banners} /> */}

          <View>
            <SliderBox
              images={this.props.banners}
              sliderBoxHeight={160}
              // onCurrentImagePressed={(index) =>
              //   // console.warn(`image ${index} pressed`)
              // }
              dotColor="orange"
              inactiveDotColor="#90A4AE"
              parentWidth={this.state.width}
              ImageComponentStyle={{
                // borderRadius: 5,
                width: '100%',
                resizeMode: 'cover',
              }}
              imageLoadingColor="#2196F3"
              autoplay
              circleLoop
              resizeMethod={'resize'}
              resizeMode={'cover'}
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
          </View>

          <MySeparator />
          <View>{this.showParentCategories()}</View>
          <MySeparator />

          <CallOrder />

          {/* <MySeparator /> */}
          <View style={{}}>
            <View style={[{backgroundColor: primaryDark, padding: 10}]}>
              <Text
                style={[
                  styles.titleStyle,
                  {color: '#FFF', fontWeight: 'bold'},
                ]}>
                JUST FOR YOU
              </Text>
            </View>
            <View style={styles.productContainer}>
              <FlatList
                horizontal
                data={recommendations}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => JSON.stringify(item.id)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
              />
            </View>
          </View>

          {/* <MySeparator /> */}

          <View style={{}}>
            <View style={[{backgroundColor: 'orange', padding: 10}]}>
              <Text
                style={[
                  styles.titleStyle,
                  {color: '#FFF', fontWeight: 'bold'},
                ]}>
                NEW ARRIVALS
              </Text>
            </View>
            <View style={styles.productContainer}>
              <FlatList
                horizontal
                data={newarrivals}
                renderItem={(item) => this.renderNewArrival(item)}
                keyExtractor={(item) => JSON.stringify(item.id)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
              />
            </View>
          </View>
          {/* <MySeparator /> */}
          <View style={{}}>
            <View style={[{backgroundColor: '#FF0000', padding: 10}]}>
              <Text
                style={[
                  styles.titleStyle,
                  {color: '#FFF', fontWeight: 'bold'},
                ]}>
                BEST SELLER
              </Text>
            </View>
            <View style={styles.productContainer}>
              <FlatList
                horizontal
                data={bestseller}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => JSON.stringify(item.id)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
              />
            </View>
          </View>
          {/* <MySeparator /> */}
          <View style={[{marginBottom: 50}]}>
            <View style={{backgroundColor: 'orange', padding: 10}}>
              <Text
                style={[
                  styles.titleStyle,
                  {color: '#FFF', fontWeight: 'bold'},
                ]}>
                FEATURED PRODUCTS
              </Text>
            </View>
            <View style={styles.productContainer}>
              <FlatList
                horizontal
                data={featured}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => JSON.stringify(item.id)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: 'row',
                }}
              />
            </View>
          </View>
          {this.showModal()}
        </ScrollView>
        {this.showSignInLayer()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: primaryBg,
  },
  identityHeader: {
    backgroundColor: '#157ed2',
  },
  tinyLogo: {
    width: Dimensions.get('window').width,
    height: 40,
    // marginTop: 10,
    alignSelf: 'flex-start',
    resizeMode: 'contain',
  },
  titleStyle: {
    fontWeight: 'bold',
    // color: primaryColor,
    color: primaryDark,
    fontSize: 11,
  },
  titleContainer: {
    paddingBottom: 10,
    paddingTop: 10,
  },
  productMain: {
    padding: 5,
    flex: 1,
  },
  productContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 1.5,
    justifyContent: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 0,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const mapStateToProps = (state) => ({
  banners: state.banners.banners,
  featured: state.products.featured,
  bestseller: state.products.bestseller,
  recommendations: state.products.recommendations,
  newarrivals: state.products.newarrivals,
  categories: state.categories.categories,
  cart: state.carts.cart,
  user: state.user.user,
});

const ActionCreators = Object.assign(
  {},
  {
    setCategories,
    setBanners,
    setNewArrivals,
    setFeatured,
    setBestSeller,
    setBrands,
    setBrandsFetched,
    setLoading,
    setRecentlyViewed,
    setRecommendations,
  },
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
