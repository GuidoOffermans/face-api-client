import * as faceapi from 'face-api.js';

// Load models and weights
export async function loadModels() {
	const MODEL_URL = process.env.PUBLIC_URL + '/models';
	await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
	await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
	await faceapi.loadFaceRecognitionModel(MODEL_URL);
	return MODEL_URL;
}

export async function getFullFaceDescription(blob, inputSize = 512) {
	// tiny_face_detector options
	let scoreThreshold = 0.5;
	const OPTION = new faceapi.TinyFaceDetectorOptions({
		inputSize,
		scoreThreshold
	});

	const useTinyModel = true;

	// fetch image to api
	let img = await faceapi.fetchImage(blob);

	// detect all faces and generate full description from image
	// including landmark and descriptor of each face
	let fullDesc = await faceapi
		.detectAllFaces(img, OPTION)
		.withFaceLandmarks(useTinyModel)
		.withFaceDescriptors();
	return fullDesc;
}

const maxDescriptorDistance = 0.5;
export async function createMatcher(users) {
	console.log('users:', users);
	let labeledDescriptors = users.map(
		(user) =>
			new faceapi.LabeledFaceDescriptors(user.name, [
				new Float32Array(user.descriptors)
			])
	);

	console.log('labeled', labeledDescriptors);

	// Create face matcher (maximum descriptor distance is 0.5)
	let faceMatcher = new faceapi.FaceMatcher(
		labeledDescriptors,
		maxDescriptorDistance
	);
	console.log(';', faceMatcher);
	return faceMatcher;
}
