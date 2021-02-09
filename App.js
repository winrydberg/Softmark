/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  Modal,
  Dimensions,
  BackHandler,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Container, Content, StyleProvider} from 'native-base';
import material from './native-base-theme/variables/material';
import Setup from './src/Setup';
import getTheme from './native-base-theme/components/index';
import SplashScreen from 'react-native-splash-screen';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import axios from './src/config/axios';
import {setCategories} from './src/actions/categories';
import {setBanners} from './src/actions/banners';
import {setUser} from './src/actions/user';
import {setCart} from './src/actions/cart';
import FlashMessage from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import {
  setNewArrivals,
  setFeatured,
  setBestSeller,
  setRecommendations,
  setLoading,
  setRecentlyViewed,
} from './src/actions/products';
import {Root} from 'native-base';
import {
  userKey,
  baseBannerURL,
  cartKey,
  primaryColor,
  recentlyViewedKey,
} from './src/constants';
import Loader from 'react-native-modal-loader';
import VersionCheck from 'react-native-version-check';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentviewsids: [],
    };
  }

  async componentDidMount() {
    await this.checkUpdateNeeded();
    await this.getData();
    this.loadInitialData();
    // SplashScreen.hide();
  }

  checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      // const latestVersion = await VersionCheck.getLatestVersion();
      // const currentVersion = VersionCheck.getCurrentVersion();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using',
          [
            {
              text: 'UPDATE',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {}
  };

  /**
   * get user info from local storage
   */
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
      alert(e.message);
    }
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

  loadInitialData = () => {
    let categoriesURI = '/get-categories';
    let bannerURI = '/get-banners';
    let indexURI = '/index';
    let recommendationURI = '/recommendations';
    let recentViewsURI = '/recent-views';

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
          // alert(JSON.stringify(respBanners.data.banners));
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
          // alert(JSON.stringify(sliders));

          actions.setRecommendations(respRecommendations.data.recommendations);
          actions.setNewArrivals(respIndex.data.newarrivals);
          actions.setBestSeller(respIndex.data.bestsellers);
          actions.setFeatured(respIndex.data.featured);
          actions.setCategories(respCategories.data.categories);
          actions.setBanners(sliders);
          actions.setRecentlyViewed(respRecentViews.data.recentviews);

          actions.setLoading(false);
          SplashScreen.hide();
        },
      )
      .catch((error) => {
        let {actions} = this.props;
        alert(error.message);
        actions.setLoading(false);
        SplashScreen.hide();
      });
  };

  loadingIndicator = () => {
    if (this.props.loading) {
      return (
        <View>
          <ActivityIndicator size="small" color="orange" />
        </View>
      );
    } else {
      return;
    }
  };
  render() {
    return (
      <>
        {/* {this.loadingIndicator()} */}
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={'#157ed2'} />

          <Modal
            animationType="none"
            style={{
              alignSelf: 'center',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            transparent={true}
            visible={this.props.loading}
            onRequestClose={() => {}}>
            <ActivityIndicator
              style={{marginTop: Dimensions.get('window').height / 2 + 100}}
              size="large"
              color="#FFF"
            />
          </Modal>

          <Root>
            <StyleProvider style={getTheme(material)}>
              <Setup></Setup>
            </StyleProvider>
          </Root>
        </NavigationContainer>
      </>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => ({
  categories: state.categories,
  loading: state.products.isLoading,
});

const ActionCreators = Object.assign(
  {},
  {
    setCategories,
    setBanners,
    setNewArrivals,
    setFeatured,
    setBestSeller,
    setRecommendations,
    setUser,
    setCart,
    setLoading,
    setRecentlyViewed,
  },
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
