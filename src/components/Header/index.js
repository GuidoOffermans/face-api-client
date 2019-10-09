import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
	return (
		<header id="header">
			<h2>FACIAL RECOGNITION APP</h2>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/check">verify</Link>
				</li>
				<li>
					<Link to="/photo">signUp</Link>
				</li>
			</ul>
		</header>
	);
};

export default Header;
