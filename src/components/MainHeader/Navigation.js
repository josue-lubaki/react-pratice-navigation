import React, { useContext } from 'react';

import classes from './Navigation.module.css';
import AuthContext from '../../store/auth-context';

const Navigation = () => {
	const authContext = useContext(AuthContext);

	return (
		<nav className={classes.nav}>
			<ul>
				{authContext.isLoggedIn && (
					<li>
						<a href='/'>Users</a>
					</li>
				)}
				{authContext.isLoggedIn && (
					<li>
						<a href='/'>Admin</a>
					</li>
				)}
				{authContext.isLoggedIn && (
					<li>
						<button onClick={authContext.onLogout}>Logout</button>
					</li>
				)}
			</ul>
		</nav>
	);
};

export default Navigation;
