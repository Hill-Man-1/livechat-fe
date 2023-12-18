/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { postRequest, baseUrl } from "../utils/services";
import { useNavigate } from 'react-router-dom';
import { ChatContext } from "./ChatContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        firstname: "",
        lastname: "",
        username:"",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        emailOrUsername: "",
        password: "",
    });

    const { emitLogout } = useContext(ChatContext);

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    }, []);


    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    const registerUser = useCallback(async (e) => {
        e.preventDefault();

        setIsRegisterLoading(true);
        setRegisterError(null);

        try {
            const responseData = await postRequest(`${baseUrl}/auth/register`, registerInfo);

            setIsRegisterLoading(false);

            if (responseData.error) {
                return setRegisterError(responseData);
            }

            navigate('/login');
        } catch (error) {
            console.error("An error occurred during registration:", error);
            setRegisterError({ error: true, message: "An unexpected error occurred." });
        }
    }, [registerInfo, navigate]);

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        try {
            const responseData = await postRequest(`${baseUrl}/auth/login`, loginInfo);
            setIsLoginLoading(false);
            if (responseData.error) {
                return setLoginError(responseData);
            }
            localStorage.setItem("User", JSON.stringify(responseData));
            setUser(responseData);
            navigate('/chat');
        } catch (error) {
            console.error("An error occurred during login:", error);
            setLoginError({ error: true, message: "An unexpected error occurred." });
        }
    }, [loginInfo, navigate]);

    const logoutUser = useCallback(() => {
        if (user) {
            emitLogout(user._id); // Emit logout event before actually logging out
        }
        localStorage.removeItem("User");
        setUser(null);
        navigate('/login');
    }, [user, navigate, emitLogout]);

    return (
        <AuthContext.Provider
            value={{
                user,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginUser,
                loginError,
                loginInfo,
                updateLoginInfo,
                isLoginLoading,
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};
