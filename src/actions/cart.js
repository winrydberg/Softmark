import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  INCREASE_CART_PRODUCT,
  DECREASE_CART_PRODUCT,
  CART_TOTAL_AMOUNT,
  SET_CART,
} from '../constants/index';

export function setCart(prevCart) {
  return {
    type: SET_CART,
    payload: prevCart,
  };
}

export function addProductToCart(product) {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
}

export function removeItemFromCart(product) {
  return {
    type: REMOVE_ITEM_FROM_CART,
    payload: product,
  };
}

export function increaseCartProduct(id) {
  return {
    type: INCREASE_CART_PRODUCT,
    payload: id,
  };
}

export function decreaseCartProduct(id) {
  return {
    type: DECREASE_CART_PRODUCT,
    payload: id,
  };
}

export function updateCartTotalAmount(amount) {
  return {
    type: CART_TOTAL_AMOUNT,
    payload: amount,
  };
}
