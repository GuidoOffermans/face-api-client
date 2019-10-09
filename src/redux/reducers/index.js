import { combineReducers } from 'redux';
import user from '../reducers/faces';
import users from '../reducers/users';

export default combineReducers({ user, users });
