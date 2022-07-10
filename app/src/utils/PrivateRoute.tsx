import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { MyRouteProps } from '../types'

const PrivateRoute = ({ redirectTo = '/login' }: MyRouteProps) => {
	const { isLogged, isLogging } = useContext(AuthContext);

	if (isLogging) return null;

	return isLogged ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute