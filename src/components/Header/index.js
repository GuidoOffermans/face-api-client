import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import img from './vector-face.png';

const Header = () => {
	return (
		<header id="header">
			<div className="title">
				<img className="head" src={img} />
				<h2>FACIAL RECOGNITION APP</h2>
				<div className="push" />
			</div>

			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/check">verify</Link>
				</li>
				<li>
					<Link to="/video">video</Link>
				</li>
				<li>
					<Link to="/photo">signUp</Link>
				</li>
			</ul>
		</header>
	);
};

export default Header;
