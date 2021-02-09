import {cartKey, orderKey, recentlyViewedKey, brandsKey} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeCartInStorage(cart) {
  try {
    const jsonCart = JSON.stringify(cart);
    await AsyncStorage.setItem(cartKey, jsonCart);
    return true;
  } catch (e) {
    alert(e.message);
    return false;
  }
}

export async function storeOrderInStorage(orderno) {
  try {
    const orders = JSON.parse(await AsyncStorage.getItem(orderKey));

    if (orders != null) {
      if (orders.find((item) => item == orderno) == undefined) {
        orders.push(orderno);
        const jsonOrder = JSON.stringify(orders);
        await AsyncStorage.setItem(orderKey, jsonOrder);
        return true;
      } else {
        const jsonOrder = JSON.stringify(orders);
        await AsyncStorage.setItem(orderKey, jsonOrder);
        return true;
      }
    } else {
      let neworder = [orderno];
      const jsonOrder = JSON.stringify(neworder);
      await AsyncStorage.setItem(orderKey, jsonOrder);
      return true;
    }
  } catch (e) {
    return false;
  }
}

export async function saveToRecentlyViewed(productid) {
  try {
    let recentviews = JSON.parse(await AsyncStorage.getItem(recentlyViewedKey));
    if (recentviews != null) {
      if (Array.isArray(recentviews)) {
        if (recentviews.length > 20) {
          recentviews.splice(0, 1);
        }
        recentviews.push(productid);
        await AsyncStorage.setItem(
          recentlyViewedKey,
          JSON.stringify(recentviews),
        );
        return true;
      } else {
        return false;
      }
    } else {
      let recentviews = JSON.stringify([productid]);
      await AsyncStorage.setItem(recentlyViewedKey, recentviews);
      return true;
    }
  } catch (e) {
    alert(e.message);
    return false;
  }
}

export async function removeCartFromStorage(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export async function storeBrandsInStorage(newBrands) {
  try {
    const jsonBrands = JSON.stringify(newBrands);
    await AsyncStorage.setItem(brandsKey, jsonBrands);
    return true;
  } catch (e) {
    alert(e.message);
    return false;
  }
}
