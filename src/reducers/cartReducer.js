import {
  ADD_TO_CART,
  REMOVE_ITEM_FROM_CART,
  INCREASE_CART_PRODUCT,
  DECREASE_CART_PRODUCT,
  CART_TOTAL_AMOUNT,
  SET_CART,
} from '../constants/index';

const initialState = {
  cart: [],
  totalAmount: 0,
};
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case ADD_TO_CART:
      action.payload.total = 1;
      return {
        ...state,
        cart: state.cart.concat(action.payload),
      };
    case REMOVE_ITEM_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => action.payload.id !== item.id),
      };
    case CART_TOTAL_AMOUNT:
      return {
        ...state,
        totalAmount: action.payload,
      };
    case INCREASE_CART_PRODUCT:
      const index = state.cart.findIndex((item) => item.id == action.payload); //finding index of the item
      const newState = [...state.cart]; //making a new array

      newState[index].total += 1; //changing value in the new array
      return {
        ...state, //copying the orignal state
        cart: newState, //reassingning todos to new array
      };

    case DECREASE_CART_PRODUCT:
      const index2 = state.cart.findIndex((item) => item.id == action.payload); //finding index of the item
      const newState2 = [...state.cart]; //making a new array

      newState2[index2].total -= 1; //changing value in the new array
      return {
        ...state, //copying the orignal state
        cart: newState2, //reassingning todos to new array
      };
    default:
      return state;
  }
};
export default cartReducer;
