import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Content,
} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  StatusBar,
  Image,
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {primaryColor} from '../constants';
import Product from '../components/Product';
import BrandProduct from '../components/BrandProduct';

class BrandDetails extends Component {
  constructor(props) {
    super(props);

    // console.log(this.props);
  }

  renderProduct = ({item}) => {
    return (
      //   <View style={{margin: 20}}>
      //     <Product product={item} navigation={this.props.navigation} />
      //   </View>
      <View style={{flex: 1}}>
        <BrandProduct product={item} navigation={this.props.navigation} />
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
            <Title>{this.props.brand.name}</Title>
          </Body>
          <Right />
        </Header>

        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.brand.products}
            renderItem={this.renderProduct}
            keyExtractor={(item) => item.id.toString()}
            // numColumns={2}
            contentContainerStyle={{
              //   justifyContent: 'space-between',
              //   alignItems: 'flex-start',
              flexDirection: 'column',
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
  },
});

const mapStateToProps = (state) => ({
  brand: state.brands.selectedbrand,
});

// const ActionCreators = Object.assign(
//   {},
//   {
//     setBrands,
//     setBrandsFetched,
//   },
// );

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(ActionCreators, dispatch),
// });

export default connect(mapStateToProps)(BrandDetails);
