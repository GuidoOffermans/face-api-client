import request from 'superagent';
// import store from '../store';

import {
	getFullFaceDescription,
	createMatcher
} from '../../api/face';

const baseUrl = 'http://localhost:4000';

export const ALL_USERS_FETCHED = 'ALL_USERS_FETCHED';
export const SIGNUP_SEND = 'SIGNUP_SEND';

// const JSON_PROFILE = require('../../descriptors/bnk48.json');

const allUsersFetched = (users) => ({
	type: ALL_USERS_FETCHED,
	users
});

export const getAllUsers = () => async (dispatch) => {
	try {
		const response = await request.get(`${baseUrl}/user`);

		const users = response.body.map(
			(user) =>
				(user = {
					...user,
					descriptors: Object.values(user.descriptors)
				})
		);

		await dispatch(allUsersFetched(users));
	} catch (err) {
		console.error(err);
	}
};

const signUpSend = (user) => ({
	type: SIGNUP_SEND,
	user
});

export const signUp = (descriptors, name) => async (dispatch) => {
	const data = {
		descriptors: descriptors,
		name: name
	};
	console.log('data', data);
	try {
		const response = await request
			.post(`${baseUrl}/sign-up`)
			.send(data);

		const user = await {
			...response.body,
			descriptors: Object.values(response.body.descriptors)
		};

		await dispatch(signUpSend(user));
	} catch (err) {
		console.error(err);
	}
};
