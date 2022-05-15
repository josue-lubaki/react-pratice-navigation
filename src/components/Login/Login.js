import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const USER_INPUT = 'USER_INPUT';
const INPUT_BLUR = 'INPUT_BLUR';

const emailReducer = (state, action) => {
	if (action.type === USER_INPUT) {
		return { value: action.val, isValid: action.val.includes('@') };
	}
	if (action.type === INPUT_BLUR) {
		return { value: state.value, isValid: state.value.includes('@') };
	}
	return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
	if (action.type === USER_INPUT) {
		return { value: action.val, isValid: action.val.trim().length > 6 };
	}
	if (action.type === INPUT_BLUR) {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return { value: '', isValid: false };
};

const Login = () => {
	const authContext = useContext(AuthContext);
	const [formIsValid, setFormIsValid] = useState(false);

	// my useReducers
	const [emailState, dispatchEmail] = useReducer(emailReducer, {
		value: '',
		isValid: null,
	});

	const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
		value: '',
		isValid: null,
	});

	// using this for don't want rerun the effect whenever prompts change
	const { isValid: emailIsValid } = emailState;
	const { isValid: passwordIsValid } = passwordState;

	useEffect(() => {
		const identifier = setTimeout(() => {
			console.log('checking from validity!');
			setFormIsValid(emailIsValid && passwordIsValid);
		}, 500);

		return () => {
			console.log('CLEANUP');
			clearTimeout(identifier);
		};
	}, [emailIsValid, passwordIsValid]);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: USER_INPUT, val: event.target.value });
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: USER_INPUT, val: event.target.value });
	};

	const validateEmailHandler = () => {
		dispatchEmail({ type: INPUT_BLUR });
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: INPUT_BLUR });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		authContext.onLogin(emailState.value, passwordState.value);
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${
						emailState.isValid === false ? classes.invalid : ''
					}`}
				>
					<label htmlFor='email'>E-Mail</label>
					<input
						type='email'
						id='email'
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div
					className={`${classes.control} ${
						passwordState.isValid === false ? classes.invalid : ''
					}`}
				>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={passwordState.value}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type='submit' className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
