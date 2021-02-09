import React, {Component} from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Item,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor} from '../constants';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Product from '../components/Product';
// import {SafeAreaView} sfrom 'react-native-safe-area-context';

class RecentlyViewed extends Component {
  constructor(props) {
    super(props);
  }

  renderItem = ({item}) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width / 2 - 10,
          margin: 5,
          alignSelf: 'center',
          // marginLeft: 5,
        }}>
        <Product product={item} navigation={this.props.navigation} />
      </View>
    );
  };
  render() {
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
            <Title>Recently Viewed</Title>
          </Body>
          <Right />
        </Header>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.recentlyviewed.reverse()}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              justifyContent: 'center',
              alignSelf: 'center',
              // alignItems: 'center',
            }}
          />
        </SafeAreaView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
});

const mapStateToProps = (state) => ({
  recentlyviewed: state.products.recentlyviewed,
});

const ActionCreators = Object.assign({}, {});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentlyViewed);
