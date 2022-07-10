import { createContext, FC, useEffect, useState } from "react";
import { IAuthContext } from "../types";
import { useApi } from "../utils";

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

type AuthContextProps = {
	children: JSX.Element;
}

export const AuthContextProvider: FC<AuthContextProps> = ({ children }) => {
	const [isLogged, setLogged] = useState(false);
	const [isLogging, setLogging] = useState(false);
	const api = useApi();

	const revalidate = () => {
		setLogging(true);
		api.get('/auth/check').then(res => {
			console.log(res.data);
			if (res.status === 200) {
				setLogging(false);
				setLogged(true);
			}
		}).catch(err => {
			console.log(err);
			if (err.response.status === 401) {
				setLogging(false);
				setLogged(false);
			}
		});
	}

	useEffect(() => {
		console.log('changed');
		if (!isLogged) revalidate();
	}, [isLogged]);

	return (
		<AuthContext.Provider value={{ isLogged, isLogging, setLogged }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext;