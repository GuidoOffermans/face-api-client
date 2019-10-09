import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Resizer from 'react-image-file-resizer';

import { getAllUsers } from '../../redux/actions/faces';

import {
	loadModels,
	getFullFaceDescription,
	createMatcher
} from '../../api/face';
import './userChecker.css';

const loadingImg = require('../../views/load.gif');

const UserChecker = (props) => {
	const [ setupRan, setSetupRan ] = useState(false);
	const [ detections, setDetections ] = useState(null);
	const [ descriptors, setDescriptors ] = useState(null);
	const [ faceMatcher, setFaceMatcher ] = useState(null);
	const [ imageURL, setImageURL ] = useState(null);
	const [ loading, setLoading ] = useState(false);

	const setup = async () => {
		console.log('setup runs..');
		await loadModels();
		await getAllFaces();
		await checkImg();
		setLoading(false);
	};

	const getAllFaces = async () => {
		await props.getAllUsers();
	};

	const checkImg = async () => {
		await loadModels();
		const fullDesc = await getFullFaceDescription(imageURL);
		console.log('fulldesc', fullDesc);
		const detections = fullDesc.map((fd) => fd.detection);
		const descriptors = fullDesc.map((fd) => fd.descriptor);

		setDetections(detections);
		setDescriptors(descriptors);

		console.log('detections', detections);
		console.log('descripors', descriptors);
	};

	const getUsers = async () => {
		const faceMatcher = await createMatcher(props.users);
		setFaceMatcher(faceMatcher);
	};

	if (props.users && faceMatcher === null) {
		getUsers();
	}

	let matches = null;
	let drawBox = null;

	if (detections && descriptors) {
		matches = descriptors.map((descriptor) =>
			faceMatcher.findBestMatch(descriptor)
		);
		console.log('matches--', matches);
		drawBox = detections.map((detection) => {
			let _H = detection.box.height;
			let _W = detection.box.width;
			let _X = detection.box._x;
			let _Y = detection.box._y;
			return { _H, _W, _X, _Y };
		});
		console.log('drawBox', drawBox);
	}

	const renderBox = () => {
		console.log(matches);
		console.log('renderbox detec', detections);

		return detections.map((detection, i) => {
			let name = '';
			if (matches) {
				name = matches[i]._label;
			}
			console.log('renderbox single detec', detection.box);
			let _H = detection.box.height;
			let _W = detection.box.width;
			let _X = detection.box._x;
			let _Y = detection.box._y;
			return (
				<div key={i}>
					<div
						className=" changeSize"
						style={{
							borderRadius: '1rem 1rem 0 0',
							position: 'absolute',
							border: 'solid',
							borderColor: '#11e483',
							height: _H,
							width: _W,
							transform: `translate(${_X}px,${_Y}px)`
						}}
					>
						<p
							style={{
								borderRadius: '0 0 1rem 1rem ',
								backgroundColor: '#11e483',
								border: 'solid',
								borderColor: '#11e483',
								width: _W,
								marginTop: 0,
								fontSize: '1rem',
								fontWeigth: '600',
								color: 'black',
								transform: `translate(-3px,${_H}px)`
							}}
						>
							{name}
						</p>
					</div>
				</div>
			);
		});
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
				setImageURL(uri);
			},
			'base64' // is the output type of the new image
		);
		// setImageURL(URL.createObjectURL(event.target.files[0]));
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		setup();
	};

	const drawAll = () => {
		if (!loading) {
			return (
				<div id="faceChecker">
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
						<button>check</button>
					</form>
					<div
						className="fotobox"
						style={{
							position: 'relative'
						}}
					>
						<div
							style={{
								position: 'absolute'
							}}
						>
							{detections && drawBox !== null ? (
								renderBox()
							) : null}

							{imageURL !== null ? (
								<img
									className="img"
									src={imageURL}
									alt="imageURL"
								/>
							) : null}
						</div>
					</div>
				</div>
			);
		} else if (loading) {
			return (
				<div
					id="faceChecker"
					style={{ position: 'relative' }}
				>
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
				</div>
			);
		}
	};

	return drawAll();
};

const mapStateToProps = (state) => {
	return {
		user: state.user,
		users: state.users
	};
};

export default connect(mapStateToProps, { getAllUsers })(UserChecker);
