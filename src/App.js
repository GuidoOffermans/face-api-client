import React from 'react';
import { Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import './App.css';

function App() {
	return (
		<div className="App">
			<Header />
			<main>
				<Route exact path="/" component={Home} />
			</main>
		</div>
	);
}

export default App;
