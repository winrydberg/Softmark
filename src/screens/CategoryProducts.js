import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Tab,
  Tabs,
  ScrollableTab,
  Card,
  CardItem,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor, primaryBg, baseIMGUrl} from '../constants';
import {
  StatusBar,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {FlatList} from 'react-native-gesture-handler';
import Product from '../components/Product';
import TabItem from '../components/TabItem';
import {
  setCategories,
  setSelectedCategory,
  setViewAllCategory,
} from '../actions/categories';
import axios from '../config/axios';
import MiniProduct from '../components/MiniProduct';
import MidProduct from '../components/MidProduct';
import {setSelectedProduct} from '../actions/products';

class CategoryProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: this.props.mycategory.subs,
      category: this.props.mycategory,
      headerColor: primaryColor,
      selectedCategory: null,
      categoryid: null,
      loading: false,
      data: [],
      archive: [],
    };

    // alert(this.props.color);
    // console.log(this.props);
  }

  componentDidMount() {
    if (this.props.color != undefined) {
      this.setState({
        headerColor: this.props.color,
      });
    }
    if (this.props.mycategory.subs.length > 0) {
      this.setState({
        selectedCategory: this.props.mycategory.subs[0],
        categoryid: this.props.mycategory.subs[0].id,
        loading: true,
      });
      this.getSelectedCategoryProduct(this.props.mycategory.subs[0]);
    } else {
      this.setState({
        selectedCategory: this.props.mycategory,
        categoryid: this.props.mycategory.id,
        loading: true,
      });
      this.getSelectedCategoryProduct(this.props.mycategory);
    }
    // this.getSelectedCategoryProduct();
  }

  getSelectedCategoryProduct = (item) => {
    var cat = this.state.archive.find((x) => x.mother.id === item.id);

    if (cat === undefined) {
      axios
        .post('/category-products', {
          category: item.id,
        })
        .then(async (response) => {
          this.setState({
            loading: false,
          });

          if (response.data.status == 'success') {
            let oldstate = this.state.archive;
            oldstate.push({
              mother: item,
              children: response.data.data,
            });
            await this.setState({
              data: response.data.data,
              archive: oldstate,
            });

            // console.log(this.state.data);
          }
        })
        .catch((error) => {
          // console.log(error);
          this.setState({
            loading: false,
          });
          alert(JSON.stringify(error.message));
        });
    } else {
      this.setState({
        loading: false,
        data: cat.children,
      });
    }
  };

  setcategory = (item) => {
    this.props.actions.setSelectedCategory(item);
    this.setState({
      selectedCategory: item,
      categoryid: item.id,
      loading: true,
    });

    this.getSelectedCategoryProduct(item);
  };

  /**
   *
   * @param {category} item
   */
  goToViewMore = async (category) => {
    // alert('Hello');
    this.props.actions.setViewAllCategory(category);
    this.props.navigation.navigate('CategoryDetails');
  };

  renderSubCategoryItem = (sub) => {
    return (
      <Card style={{elevation: 0}}>
        <CardItem>
          <Text style={styles.subCatHeader}>{sub.item.name}</Text>
          {/* <Pressable onPressIn={() => {}}>
            <Text style={styles.viewMore}>VIEW MORE</Text>
          </Pressable> */}
          <Pressable onPressIn={() => this.goToViewMore(sub.item)}>
            <Text style={styles.viewMore}>VIEW MORE</Text>
          </Pressable>
        </CardItem>
        {/* <CardItem> */}
        <Body style={{justifyContent: 'center'}}>
          <FlatList
            data={sub.item.products}
            renderItem={(item) => this.renderMiniPro(item)}
            keyExtractor={(item) => item.id}
            numColumns={3}
          />
        </Body>
        {/* </CardItem> */}
      </Card>
    );
    // }
  };

  showSubCategories = () => {
    if (this.state.loading == false) {
      if (this.state.data.length > 0) {
        return (
          <View style={{marginBottom: 50}}>
            <FlatList
              data={this.state.data}
              renderItem={(item) => this.renderSubCategoryItem(item)}
              keyExtractor={(item) => JSON.stringify(item.id)}
            />
          </View>
        );
      } else {
        return (
          <View>
            <Text>No Products Found</Text>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimensions.get('window').height / 3,
          }}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={{fontSize: 10}}>Loading... Please wait...</Text>
        </View>
      );
    }
  };

  calculateDiscount = (newprice, oldprice) => {
    var diff = oldprice - newprice;
    var percentage = (diff / oldprice) * 100;
    return Math.round(percentage);
  };

  goToProductDetails = (product) => {
    let {actions} = this.props;
    actions.setSelectedProduct(product);
    this.props.navigation.navigate('Details');
  };

  noSubCategories = () => {
    if (this.state.loading) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: Dimensions.get('window').height / 3,
          }}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={{fontSize: 10}}>Loading... Please wait...</Text>
        </View>
      );
    } else {
      if (this.state.data.length > 0) {
        return (
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginBottom: 50,
            }}>
            <FlatList
              data={this.state.data[0].products}
              renderItem={(item) => {
                return (
                  <Pressable
                    onPress={() => this.goToProductDetails(item.item)}
                    style={{
                      margin: 10,
                      borderWidth: 0.5,
                      borderColor: '#e5e5e5',
                      backgroundColor: '#FFF',
                    }}>
                    <Image
                      defaultSource={require('../assets/images/placeholder.png')}
                      source={{
                        uri:
                          baseIMGUrl +
                          '/' +
                          item.item.media[0].id +
                          '/' +
                          item.item.media[0].file_name,
                        // uri:
                        //   baseIMGUrl +
                        //   '/' +
                        //   this.props.product.media[0].id +
                        //   '/conversions/' +
                        //   this.urlencode(
                        //     this.formatImage(this.props.product.media[0].file_name),
                        //   ),
                      }}
                      style={{
                        height: Dimensions.get('window').width / 2 - 50,
                        width: Dimensions.get('window').width / 2 - 20,
                      }}
                    />
                    <View
                      style={{
                        width: Dimensions.get('window').width / 2 - 20,
                        height: 100,
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{margin: 10}}>
                          {item.item.title}
                        </Text>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                          GHC {item.item.pricing[0].sale_price}
                        </Text>

                        <View style={{flexDirection: 'row'}}>
                          <Text
                            st
                            style={{
                              color: 'gray',
                              textDecorationLine: 'line-through',
                              textDecorationStyle: 'solid',
                              // marginBottom: 10,
                            }}>
                            GHC {item.item.pricing[0].price}
                          </Text>
                          <View
                            style={{
                              backgroundColor: '#F0B577',
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderRadius: 2,
                              alignItems: 'center',
                              marginLeft: 10,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 10,
                                color: '#fff',
                                fontWeight: 'bold',
                              }}>
                              -
                              {this.calculateDiscount(
                                item.item.pricing[0].sale_price,
                                item.item.pricing[0].price,
                              )}
                              %
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.id}
              numColumns={2}
            />
          </View>
        );
      } else {
        return (
          <View>
            <Text>No Product Found</Text>
          </View>
        );
      }
    }
  };

  renderItem = ({item}) => {
    if (this.state.categoryid == item.id) {
      return (
        <TouchableOpacity
          onPress={() => this.setcategory(item)}
          style={{
            borderLeftColor: 'orange',
            backgroundColor: '#f6f6f6',
            borderLeftWidth: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TabItem category={item} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.setcategory(item)}>
          <TabItem category={item} />
        </TouchableOpacity>
      );
    }
  };

  renderMiniPro = (product) => {
    return (
      <View
        style={{
          margin: 2,
          // alignItems: 'center',
          // justifyContent: 'center',
          // alignSelf: 'center',
          // marginBottom: 10,
        }}>
        <MiniProduct
          product={product.item}
          navigation={this.props.navigation}
        />
      </View>
    );
  };

  renderMidProduct = (product) => {
    return (
      <View
        style={{
          padding: 5,
          // margin: 5,
          // flex: 1,
          width: Dimensions.get('window').width / 2,
        }}>
        <MidProduct product={product.item} navigation={this.props.navigation} />
      </View>
    );
  };

  renderContent = () => {
    if (this.props.mycategory.subs.length <= 0) {
      return (
        <View style={styles.mainContainer}>
          <SafeAreaView style={styles.tabContentContainer}>
            <View style={styles.selectedCatContainer}>
              <Text style={styles.selectetedCatText}>
                {this.state.selectedCategory != null
                  ? this.state.selectedCategory.name
                  : 'Category Products'}
              </Text>
            </View>

            <View>{this.noSubCategories()}</View>
          </SafeAreaView>
        </View>
      );
    } else {
      return (
        <View style={styles.mainContainer}>
          <SafeAreaView style={styles.tabContainer}>
            <FlatList
              data={this.state.categories}
              renderItem={(item) => this.renderItem(item)}
              keyExtractor={(item) => JSON.stringify(item.id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                // alignItems: 'center',
                // justifyContent: 'center',
              }}
            />
          </SafeAreaView>
          <View style={{backgroundColor: '#f6f6f6', width: 5}}></View>

          <SafeAreaView style={styles.tabContentContainer}>
            <View style={styles.selectedCatContainer}>
              <Text style={styles.selectetedCatText}>
                {this.state.selectedCategory != null
                  ? this.state.selectedCategory.name
                  : 'Category Products'}
              </Text>
            </View>

            <View>{this.showSubCategories()}</View>
          </SafeAreaView>
        </View>
      );
    }
  };

  render() {
    return (
      <Container>
        <Header
          noShadow
          style={{
            backgroundColor: this.state.headerColor,
          }}>
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
            <Title>{this.props.mycategory.name}</Title>
          </Body>
        </Header>
        {this.renderContent()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  tabContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  tabContentContainer: {
    flex: 4,

    backgroundColor: '#f6f6f6',
  },
  selectedCatContainer: {
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    borderRadius: 2,
    backgroundColor: '#fff',
    // marginRight: 3,
    marginLeft: 2,
  },
  selectetedCatText: {
    fontWeight: 'bold',
    marginLeft: 10,
  },

  subCatHeader: {
    color: 'gray',
    fontWeight: 'bold',
    width: '70%',
  },
  viewMore: {
    fontSize: 12,
    color: primaryColor,
    alignSelf: 'flex-end',
  },
});

const mapStateToProps = (state) => ({
  mycategory: state.categories.mycategory,
  newarrivals: state.products.newarrivals,
});

const ActionCreators = Object.assign(
  {},
  {setCategories, setSelectedCategory, setSelectedProduct, setViewAllCategory},
);

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryProducts);
