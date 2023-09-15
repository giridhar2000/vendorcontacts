import React, { useState, useEffect, createContext } from 'react';
import { getUser } from "../utils/profile_helper";
import { useQuery } from "react-query";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { data: profile, isLoading } = useQuery("profile", getUser);

	return (
		<UserContext.Provider value={[profile,isLoading]}>
			{ children}
		</UserContext.Provider>
	);
};


export default UserContext;