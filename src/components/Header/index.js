import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<div>
			<h2>BNK48 Facial Recognition App</h2>
			<li>
				<Link to="/">Photo Input</Link>
			</li>
			<li>
				<Link to="/">Video Camera</Link>
			</li>
		</div>
	);
};

export default Header;
