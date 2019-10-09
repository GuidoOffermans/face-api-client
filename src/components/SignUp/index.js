import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';

import { signUp } from '../../redux/actions/faces';
import {
	loadModels,
	getFullFaceDescription,
	createMatcher
} from '../../api/face';
import './signup.css';

const testImg = require('../../img/guido.jpg');

const SignUp = (props) => {
	const [ allFaces, setAllFaces ] = useState(null);
	const [ imageURL, setImageURl ] = useState(null);
	const [ formData, setFormData ] = useState({
		name: ''
	});

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
		await loadModels();
		console.log('url', imageURL);
		const fullDesc = await getFullFaceDescription(imageURL);
		console.log('fulldesc', fullDesc);
		await props.signUp(fullDesc[0].descriptor, formData.name);
		setFormData({
			name: ''
		});
	};

	return (
		<div id="faceSubmit">
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

			{imageURL !== null ? (
				<img className="img" src={imageURL} alt="imageURL" />
			) : null}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

export default connect(mapStateToProps, { signUp })(SignUp);
