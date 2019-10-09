import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';
import { Redirect } from 'react-router-dom';

import { signUp } from '../../redux/actions/faces';
import {
	loadModels,
	getFullFaceDescription,
	createMatcher
} from '../../api/face';
import './signup.css';

const testImg = require('../../img/guido.jpg');

const SignUp = (props) => {
	const [ imageURL, setImageURl ] = useState(null);
	const [ formData, setFormData ] = useState({
		name: ''
	});
	const [ loading, setLoading ] = useState(false);
	const [ redirect, setRedirect ] = useState(false);

	useEffect(() => {
		setup();
	}, []);

	const setup = async () => {
		await loadModels();
		// await getFaceDesciption();
	};

	const handleFileChange = async (event) => {
		Resizer.imageFileResizer(
			event.target.files[0], //is the file of the new image that can now be uploaded...
			400, // is the maxWidth of the  new image
			500, // is the maxHeight of the  new image
			'jpg', // is the compressFormat of the  new image
			100, // is the quality of the  new image
			0, // is the rotatoion of the  new image
			(uri) => {
				setImageURl(uri);
			},
			'base64' // is the output type of the new image
		);
		// setImageURl(URL.createObjectURL(event.target.files[0]));
	};

	const onChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		await loadModels();
		console.log('url', imageURL);
		const fullDesc = await getFullFaceDescription(imageURL);
		console.log('fulldesc', fullDesc);
		await props.signUp(fullDesc[0].descriptor, formData.name);
		setFormData({
			name: ''
		});
		setLoading(false);
		setRedirect(true);
	};

	if (!loading) {
		return (
			<div id="faceSubmit">
				<h2>SignUp</h2>
				<form onSubmit={onSubmit}>
					<input
						type="file"
						name="file"
						id="file"
						className="inputfile"
						onChange={handleFileChange}
						accept=".jpg, .jpeg, .png"
					/>
					<label for="file">
						<p>Choose a file</p>
					</label>
					<input
						className="text"
						type="text"
						name="name"
						onChange={onChange}
						value={formData.name}
						placeholder="Name"
					/>
					<button>submit</button>
				</form>
				{redirect ? (
					<h2>You have been added to the database :)</h2>
				) : null}
				{imageURL !== null ? (
					<img
						className="img"
						src={imageURL}
						alt="imageURL"
					/>
				) : null}
			</div>
		);
	} else if (loading) {
		return (
			<div id="faceChecker" style={{ position: 'relative' }}>
				<img
					className="img"
					src={imageURL}
					alt="imageURL"
					style={{
						position: 'absolute',
						opacity: '0.5',
						filter: 'brightness(50%)'
					}}
				/>
				<div
					className="cssload-loader"
					style={{ position: 'absolute' }}
				/>
				{redirect ? <Redirect to="/check" /> : null}
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

export default connect(mapStateToProps, { signUp })(SignUp);
