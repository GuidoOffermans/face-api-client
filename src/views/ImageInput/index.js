import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
	loadModels,
	getFullFaceDescription,
	createMatcher
} from '../../api/face';

import { signUp } from '../../redux/actions/faces';

const testImg = require('../../img/guido.jpg');
const JSON_PROFILE = require('../../descriptors/bnk48.json');

const ImageInput = (props) => {
	const [ detections, setDetections ] = useState(null);
	const [ matches, setMatches ] = useState(null);

	useEffect(() => {
		setUp();
	}, []);

	useEffect(
		() => {
			console.log('hi');
			getX();
		},
		[ props ]
	);

	const getX = async () => {
		if (props.user !== null) {
			console.log('props.user', props.user);
			const x = {
				guido: {
					name: 'guido',
					descriptors: Object.values(props.user.descriptor)
				}
			};
			const faceMatcher = await createMatcher(x);
			// await createMatcher(JSON_PROFILE);
			console.log('hi', faceMatcher);

			const matches = faceMatcher.findBestMatch();
			// );
			// setMatches(matches);
		}
	};

	const setUp = async () => {
		await loadModels();

		const fullDesc = await getFullFaceDescription(testImg);

		console.log('fullDesc', fullDesc);

		if (fullDesc) {
			const detections = fullDesc.map((fd) => fd.detection);
			const descriptors = fullDesc.map((fd) => fd.descriptor);

			console.log('detections', detections);
			console.log('descripors', descriptors);
			props.signUp(descriptors, 'guido');

			// const matches = descriptors.map((descriptor) =>
			// 	faceMatcher.findBestMatch(descriptor)
			// );
			// setMatches(matches);

			if (detections) {
				const drawBox = detections.map((detection) => {
					let _H = detection.box.height;
					let _W = detection.box.width;
					let _X = detection.box._x;
					let _Y = detection.box._y;
					return { _H, _W, _X, _Y };
				});
				setDetections([ ...drawBox ]);
				console.log(drawBox);
			}
		}
	};

	const renderBox = () => {
		console.log(matches);
		return detections.map((box, i) => {
			const name = '';
			if (matches) {
				return (name = matches[i]._label);
			}

			const { _H, _W, _X, _Y } = box;
			return (
				<div className="x" key={i}>
					<div
						style={{
							position: 'absolute',
							border: 'solid',
							borderColor: 'blue',
							height: _H,
							width: _W,
							transform: `translate(${_X}px,${_Y}px)`
						}}
					>
						<p
							style={{
								backgroundColor: 'blue',
								border: 'solid',
								borderColor: 'blue',
								width: _W,
								marginTop: 0,
								color: '#fff',
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
	if (detections !== null) {
		return (
			<div>
				<input
					id="myFileUpload"
					type="file"
					// onChange={this.handleFileChange}
					accept=".jpg, .jpeg, .png"
				/>
				<div
					style={{
						position: 'relative'
					}}
				>
					<div style={{ position: 'absolute' }}>
						<img src={testImg} alt="imageURL" />
					</div>
					{renderBox()}
				</div>
			</div>
		);
	} else
		return (
			<div>
				<input
					id="myFileUpload"
					type="file"
					// onChange={this.handleFileChange}
					accept=".jpg, .jpeg, .png"
				/>
				<div style={{ position: 'relative' }}>
					<div style={{ position: 'absolute' }}>
						<img src={testImg} alt="imageURL" />
					</div>
					{/* {renderBox()} */}
				</div>
			</div>
		);
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

export default connect(mapStateToProps, { signUp })(ImageInput);
