import {SET_USER} from '../constants/index';

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user,
  };
}
