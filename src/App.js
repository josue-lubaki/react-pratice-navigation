import React, { useContext } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import AuthContext from './store/auth-context';

function App() {
	const authContext = useContext(AuthContext);
	return (
		<React.Fragment>
			<MainHeader />
			<main>
				{!authContext.isLoggedIn && <Login onLogin={authContext.loginHandler} />}
				{authContext.isLoggedIn && <Home onLogout={authContext.logoutHandler} />}
			</main>
		</React.Fragment>
	);
}

export default App;
