import React, {  createContext, useState,useEffect ,useContext} from 'react';
import supabase from '../utils/supabase.config';
import { useQuery } from 'react-query';
const UserContext = createContext();



export const AuthProvider = ({ children }) => {
	const [isAuth,setIsAuth]=useState(JSON.parse(localStorage.getItem('auth')))
    const { data:auth, isLoading } = useQuery("auth",async()=>{
		const { data, error } = await supabase.auth.getUser();
        return data?.user !== null;
	});
	useEffect(() => {
		if(auth)
		setIsAuth(auth)
	}, [auth]);
	if(isLoading){
		<UserContext.Provider value={[isAuth,setIsAuth]}>
			{ children}
		</UserContext.Provider>
	}
	return (
		<UserContext.Provider value={[isAuth,setIsAuth]}>
			{ children}
		</UserContext.Provider>
	);
};


export default UserContext;