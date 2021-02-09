import {createStore, combineReducers} from 'redux';
import categoriesReducer from '../reducers/categoriesReducer';
import bannersReducer from '../reducers/bannersReducer';
import productReducer from '../reducers/productReducer';
import cartReducer from '../reducers/cartReducer';
import userReducer from '../reducers/userReducer';
import brandsReducer from '../reducers/brandsReducer';
const rootReducer = combineReducers({
  categories: categoriesReducer,
  banners: bannersReducer,
  products: productReducer,
  carts: cartReducer,
  user: userReducer,
  brands: brandsReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
