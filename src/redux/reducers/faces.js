import { SIGNUP_SEND } from '../actions/faces';

export default function(state = null, action = {}) {
	switch (action.type) {
		case SIGNUP_SEND:
			return action.user;
		default:
			return state;
	}
}
