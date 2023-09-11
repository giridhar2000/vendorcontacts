import React, { useState, useEffect, createContext } from 'react';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {
	const [ isAuth, setIsAuth ] = useState(JSON.parse(localStorage.getItem('auth')));

	return (
		<UserContext.Provider value={[isAuth,setIsAuth]}>
			{ children}
		</UserContext.Provider>
	);
};


export default UserContext;