import React, { useState, useEffect, createContext } from 'react';
import { getUser } from "../utils/profile_helper";
import { useQuery } from "react-query";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { data: profile, isLoading,remove } = useQuery("profile", getUser);

	return (
		<UserContext.Provider value={[profile,isLoading,remove]}>
			{ children}
		</UserContext.Provider>
	);
};


export default UserContext;