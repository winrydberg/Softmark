import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Home from './screens/Home';
import Categories from './screens/Categories';
import Notifications from './screens/Notifications';
import Account from './screens/Account';
import Cart from './screens/Cart';
import ProductDetails from './screens/ProductDetails';
import Login from './screens/Login';
import Register from './screens/Register';
import Feeds from './screens/Feeds';
import WebviewProductDetails from './screens/WebviewProductDetails';
import Search from './screens/Search';
import CategoryProducts from './screens/CategoryProducts';
import CompleteOrder from './screens/CompleteOrder';
import AboutApp from './screens/AboutApp';
import Brands from './screens/Brands';
import Orders from './screens/Orders';
import BrandDetails from './screens/BrandDetails';
import DeliveryDetails from './screens/DeliveryDetails';
import RecentlyViewed from './screens/RecentlyViewed';
import CategoryDetails from './screens/CategoryDetails';
import VideoTutorial from './screens/VideoTutorial';
import {primaryColor} from './constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Setup() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="HomeTabs">
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Details"
        component={ProductDetails}
        options={{
          //OTHER OPTIONS
          /*
           * forModalPresentationIOS
           * forHorizontalIOS
           * forVerticalIOS
           * forFadeFromBottomAndroid
           * forRevealFromBottomAndroid
           * */
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="WebviewProduct"
        component={WebviewProductDetails}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProducts}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="CompleteOrder"
        component={CompleteOrder}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="BrandDetails"
        component={BrandDetails}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetails}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="RecentlyViewed"
        component={RecentlyViewed}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />

      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetails}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="VideoTutorial"
        component={VideoTutorial}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: primaryColor,
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="apps" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Feeds"
        component={Feeds}
        options={{
          tabBarLabel: 'Feeds',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="logo-rss" color={color} size={size} />
          ),
          //   tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Brands"
        component={Brands}
        options={{
          tabBarLabel: 'Top Brands',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="basket" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="user-circle-o" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
