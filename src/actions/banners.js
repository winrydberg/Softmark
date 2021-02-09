import {SET_BANNERS} from '../constants/index';

export function setBanners(banners) {
  return {
    type: SET_BANNERS,
    payload: banners,
  };
}
