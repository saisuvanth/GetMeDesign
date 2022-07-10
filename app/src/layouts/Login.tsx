import React, { FC, FormEvent } from 'react';
import { Container, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import bg_img from '../assets/images/bg.jpg';
import '../assets/css/Login.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import NotificationContext from '../hooks/useNotif';
import { useApi } from '../utils';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const Login: FC = () => {
	const notify = useContext(NotificationContext);
	const api = useApi();

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		console.log(formData.get('username'))
		const data = {
			username: formData.get('username') as string,
			password: formData.get('password') as string,
		};
		console.log(data);
		api.post('/auth/login', data).then(res => {
			console.log(res);
			if (res.status === 200) {
				notify({ type: 'success', message: res.data.message });
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			} else {
				notify({ type: 'error', message: 'Login Failed' });
			}
		})
	}

	const responseGoogle = (res: CredentialResponse) => {
		console.log(res);
		api.post('/auth/google', res).then(res => {
			console.log(res);
			if (res.status === 200) {
				notify({ type: 'success', message: res.data.message })
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			} else {
				notify({ type: 'error', message: 'Login Failed' });
			}
		})
	}

	return (
		<Container className='main' style={{ backgroundImage: `url(${bg_img})` }}>
			<Container className='login-wrapper'>
				<div className='pb-3 pt-1'>
					<h2 style={{ color: 'white' }}>Login</h2>
				</div>
				<Form onSubmit={handleSubmit} className='login-form'>
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">
							<i className='fa fa-user'></i>
						</InputGroup.Text>
						<FormControl
							name='username'
							type='text'
							placeholder="Username"
							aria-label="Username"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">
							<i className='fa fa-lock'></i>
						</InputGroup.Text>
						<FormControl
							name='password'
							type='password'
							placeholder="Password"
							aria-label="Password"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
					<Button type='submit'>
						Login
					</Button>
					<Container className='form-cont'>
						<Form.Group className="mb-3" controlId="formBasicCheckbox">
							<Form.Check style={{ color: 'white' }} type="checkbox" label="Check me out" />
						</Form.Group>
						<Link to={'/forgotpwd'}>Forgot Password?</Link>
					</Container>
					<Container className='form-cont'>
						<GoogleLogin
							login_uri='https://localhost:8080/auth/google'
							type='icon'
							theme='filled_blue'
							onSuccess={responseGoogle}
							onError={() => {
								console.log('Login Failed');
							}}
						/>;
						{/* // clientId="25271568058-3olmjkgn2o92cb6fpd0dfplpk8f2apo4.apps.googleusercontent.com" */}
					</Container>
					<Container className='mt-2'>
						<div>
							Don't have an account?<Link to={'/register'}>Register Here</Link>
						</div>
					</Container>
				</Form>
			</Container>
		</Container>
	)
}

export default Login
// const g = {
// 	details: "You have created a new client application that uses libraries for user authentication or authorization that will soon be deprecated. New clients must use the new libraries instead; existing clients must also migrate before these libraries are deprecated. See the [Migration Guide](https://developers.google.com/identity/gsi/web/guides/gis-migration) for more information.",
// 	error: "idpiframe_initialization_failed"
// }