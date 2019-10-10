import React from 'react';
import { Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import SignUp from './components/SignUp';
import UserChecker from './components/UserChecker';
import VideoInput from './components/VideoInput';
import './App.css';

function App() {
	return (
		<div className="App">
			<Header />
			<main>
				<Route exact path="/" component={Home} />
				<Route path="/photo" component={SignUp} />
				<Route path="/check" component={UserChecker} />
				<Route path="/video" component={VideoInput} />
			</main>
		</div>
	);
}

export default App;
