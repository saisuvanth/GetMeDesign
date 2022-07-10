import { FC, MouseEvent, useContext } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import NotificationContext from '../hooks/useNotif';
import { useApi } from '../utils';

const Home: FC = () => {
	const api = useApi();
	const notify = useContext(NotificationContext);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		api.delete('/logout').then(res => {
			console.log(res);
			if (res.status === 200) {
				notify({ type: 'info', message: res.data.message });
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			}
		}).catch(err => {
			notify({ type: 'error', message: err.response.data.message });
		})
	}

	return (
		<Navbar bg="light" expand="lg">
			<Container fluid>
				<Navbar.Brand href="#">Hello</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '100px' }}
						navbarScroll
					>
						<Nav.Link href="#action1">Home</Nav.Link>
						<Nav.Link href="#action2">Link</Nav.Link>
						<Nav.Link href="#" disabled>
							Link
						</Nav.Link>
					</Nav>
					<Button variant="outline-warning" onClick={handleClick}>Log Out</Button>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default Home;