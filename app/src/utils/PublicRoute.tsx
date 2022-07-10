import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { MyRouteProps } from '../types'

const PublicRoute = ({ redirectTo = '/' }: MyRouteProps) => {
	const { isLogged, isLogging } = useContext(AuthContext);

	if (isLogging) return null;

	return isLogged ? <Navigate to={redirectTo} /> : <Outlet />
}

export default PublicRoute