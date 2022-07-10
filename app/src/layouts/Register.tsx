import type { FC, FormEvent } from 'react';
import { Container, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import bg_img from '../assets/images/bg.jpg';
import '../assets/css/Login.css';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationContext from '../hooks/useNotif';
import { useApi } from '../utils';
import { IUser } from '../types';
import validator from 'validator';

const Register: FC = () => {
	const notify = useContext(NotificationContext);
	const api = useApi();
	const navigate = useNavigate();

	const validate = (data: IUser): boolean | void => {
		if (validator.isEmail(data.email)) {
			if (data.password.length >= 8) {
				if (data.password === data.confirmPassword) {
					return true;
				} else notify({ type: 'error', message: 'Password does not match' }); return;
			} else notify({ type: 'error', message: 'Password must be at least 8 characters' }); return;
		} else notify({ type: 'error', message: 'Invalid email' }); return;
	}

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const data: IUser = {
			username: formData.get('username') as string,
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			confirmPassword: formData.get('confirmPassword') as string,
		};
		console.log(data);
		if (validate(data)) {

			api.post('/auth/register', data).then(res => {
				console.log(res);
				if (res.status === 200) {
					notify({ type: 'success', message: 'Register Successful' });
					setTimeout(() => {
						navigate('/', { replace: true });
					}, 3000);
				} else {
					notify({ type: 'error', message: 'Register Failed' });
				}
			}).catch(err => {
				console.log(err);
				notify({ type: 'error', message: err.response.data.message });
			})
		}
	}

	return (
		<Container className='main' style={{ backgroundImage: `url(${bg_img})` }}>
			<Container className='login-wrapper'>
				<div className='pb-3 pt-1'>
					<h2 style={{ color: 'white' }}>Register</h2>
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
							<i className='fa fa-mail'></i>
						</InputGroup.Text>
						<FormControl
							name='email'
							type='email'
							placeholder="Email"
							aria-label="Email"
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
					<InputGroup className="mb-3">
						<InputGroup.Text id="basic-addon1">
							<i className='fa fa-lock'></i>
						</InputGroup.Text>
						<FormControl
							name='confirmPassword'
							type='password'
							placeholder="Confirm Password"
							aria-label="confirmPassword"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
					<Button type='submit'>
						Register
					</Button>
					<Container className='form-cont'>
						<div>
							<i style={{ fontSize: '40px' }} className='fab fa-google'></i>
						</div>
					</Container>
					<Container className='form-cont'>
						<p>
							Already have an account?
							<Link to={'/forgotpwd'}>Login</Link>
						</p>
					</Container>
				</Form>
			</Container>
		</Container>
	)
}

export default Register