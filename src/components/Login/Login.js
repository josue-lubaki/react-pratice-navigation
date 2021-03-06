import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

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

	// reference of Input component
	const emailInputRef = useRef();
	const passwordInputRef = useRef();

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
		if (formIsValid) {
			authContext.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailInputRef.current.focus();
		} else {
			passwordInputRef.current.focus();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailInputRef}
					id='email'
					type='email'
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
					value={emailState.value}
					label='E-Mail'
					isValid={emailIsValid}
				></Input>

				<Input
					ref={passwordInputRef}
					id='password'
					type='password'
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
					value={passwordState.value}
					label='password'
					isValid={passwordIsValid}
				></Input>

				<div className={classes.actions}>
					<Button type='submit' className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
