import {
  SET_BRANDS,
  SET_BRANDS_FETCHED,
  SET_SELECTED_BRAND,
} from '../constants/index';

export function setBrands(brands) {
  return {
    type: SET_BRANDS,
    payload: brands,
  };
}

export function setSelectedBrand(brand) {
  return {
    type: SET_SELECTED_BRAND,
    payload: brand,
  };
}

export function setBrandsFetched(isFetched) {
  return {
    type: SET_BRANDS_FETCHED,
    payload: isFetched,
  };
}
