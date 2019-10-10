import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Webcam from 'react-webcam';
import { getAllUsers } from '../../redux/actions/faces';
import {
	loadModels,
	getFullFaceDescription,
	createMatcher
} from '../../api/face';

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

const VideoInput = (props) => {
	// console.log('begin props', props.users);
	const [ facingMode, setFacingMode ] = useState('');
	const [ detections, setDetections ] = useState(null);
	const [ descriptors, setDescriptors ] = useState(null);
	const [ faceMatcher, setFaceMatcher ] = useState(null);
	const [ match, setMatch ] = useState(null);
	const webcam = React.useRef(null);

	useEffect(() => {
		// console.log('start');
		start();
	}, []);

	useEffect(() => {
		props.getAllUsers();
	}, []);

	// const getAllFaces = async () => {
	// 	await props.getAllUsers();
	// };

	const start = async () => {
		await loadModels();
		setInputDevice();
	};

	if (props.users && faceMatcher === null) {
		const set = async () => {
			setFaceMatcher(await createMatcher(props.users));
		};
		set();
		console.log('setface xx', faceMatcher);
		// getUsers();
	}

	const setInputDevice = () => {
		navigator.mediaDevices
			.enumerateDevices()
			.then(async (devices) => {
				let inputDevice = await devices.filter(
					(device) => device.kind === 'videoinput'
				);
				if (inputDevice.length < 2) {
					await setFacingMode('user');
				} else {
					await setFacingMode({ exact: 'environment' });
				}
				startCapture();
			});
	};

	const startCapture = () => {
		setInterval(() => {
			capture();
		}, 800);
	};

	// let faceMatcher = null;
	const capture = async () => {
		if (webcam.current) {
			await getFullFaceDescription(
				webcam.current.getScreenshot(),
				inputSize
			).then(async (fullDesc) => {
				if (!!fullDesc) {
					setDetections(fullDesc.map((fd) => fd.detection));
					setDescriptors(
						fullDesc.map((fd) => fd.descriptor)
					);
				}
				console.log('users -<>', props.users);

				console.log('setface ----', faceMatcher);

				// console.log('face---', faceMatcher);
				// if (descriptors && faceMatcher) {
				// 	console.log('matching');
				// 	let match = await descriptors.map((descriptor) =>
				// 		faceMatcher.findBestMatch(descriptor)
				// 	);
				// 	console.log('match', match);
				// 	// setMatch(match);
				// }
			});
		}
	};

	let videoConstraints = null;
	let camera = '';
	if (!!facingMode) {
		videoConstraints = {
			width: WIDTH,
			height: HEIGHT,
			facingMode: facingMode
		};
		if (facingMode === 'user') {
			camera = 'Front';
		} else {
			camera = 'Back';
		}
	}

	let drawBox = null;
	if (detections) {
		console.log('detects', detections);
		drawBox = detections.map((detection, i) => {
			let _H = detection.box.height;
			let _W = detection.box.width;
			let _X = detection.box._x;
			let _Y = detection.box._y;
			return (
				<div key={i}>
					<div
						style={{
							borderRadius: '1rem 1rem 1rem 1rem',
							position: 'absolute',
							border: 'solid',
							borderColor: '#11e483',
							height: _H,
							width: _W,
							transform: `translate(${_X}px,${_Y}px)`
						}}
					>
						{/* {!!match && !!match[i] ? (
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
								{match[i]._label}
							</p>
						) : null} */}
					</div>
				</div>
			);
		});
	}

	return (
		<div
			className="Camera"
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
			}}
		>
			<p>Camera: {camera}</p>
			<div
				style={{
					width: WIDTH,
					height: HEIGHT
				}}
			>
				<div style={{ position: 'relative', width: WIDTH }}>
					{videoConstraints ? (
						<div style={{ position: 'absolute' }}>
							<Webcam
								audio={false}
								width={WIDTH}
								height={HEIGHT}
								ref={webcam}
								screenshotFormat="image/jpeg"
								videoConstraints={videoConstraints}
							/>
						</div>
					) : null}
					{!!drawBox ? drawBox : null}
				</div>
			</div>
		</div>
	);
};
const mapStateToProps = (state) => {
	console.log('state', state.users);
	return {
		user: state.user,
		users: state.users
	};
};
export default connect(mapStateToProps, { getAllUsers })(VideoInput);
