import { ALL_USERS_FETCHED } from '../actions/faces';

export default function(state = null, action = {}) {
	switch (action.type) {
		case ALL_USERS_FETCHED:
			return action.users;
		default:
			return state;
	}
}
