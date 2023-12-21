/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { postRequest, baseUrl, getRequest } from "../utils/services";
import { useNavigate } from 'react-router-dom';
import { ChatContext } from "./ChatContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        first_name: "",
        last_name: "",
        username:"",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [registerInfoByAdmin, setRegisterInfoByAdmin] = useState({
        first_name: "",
        last_name: "",
        username:"",
        email: "",
        password: "",
        confirmpassword: "",
        role: "",
    });
    const [registerInfoMedicalPersonnel, setRegisterInfoMedicalPersonnel] = useState({
        first_name: "",
        last_name: "",
        username:"",
        email: "",
        password: "",
        confirmpassword: "",
        specialization:"", 
        hospital:"",
        role:""
    });
    const [registerInfoMedicalFacility, setRegisterInfoMedicalFacility] = useState({
        name: "",
        email: "",
        address: "",
        contact: "",
        location: {
            city: "", 
            province: ""
        }
    });
    const [hospitals, setHospitals] = useState([]);
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        usernameOrEmail: "",
        password: "",
    });

    const { emitLogout } = useContext(ChatContext);

    useEffect(() => {
        const userData = localStorage.getItem("User");
        if (userData) {
            const storedUser = JSON.parse(userData);
            if (storedUser && storedUser._id) {
                setUser(storedUser);
            }
        }
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
            const responseData = await postRequest(`${baseUrl}/api/v1/auth/register`, registerInfo);
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

    const registerUserByAdmin = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
    
        try {
            const responseData = await postRequest(`${baseUrl}/api/v1/admin/auth/registeruser`, registerInfoByAdmin);
            console.log("Sending data:", registerInfoByAdmin);
            setIsRegisterLoading(false);
    
            if (responseData.error) {
                return setRegisterError(responseData);
            }
            navigate('/login');
        } catch (error) {
            console.error("An error occurred during registration:", error);
            setRegisterError({ error: true, message: "An unexpected error occurred." });
        }
    }, [registerInfoByAdmin, navigate]);

    const updateRegisterInfoByAdmin = useCallback((info) => {
        setRegisterInfoByAdmin(info);
    }, []);

    const registerMedicalPersonnel = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
    
        try {
            const responseData = await postRequest(`${baseUrl}/api/v1/admin/auth/registerpersonnel`, registerInfoMedicalPersonnel);
            setIsRegisterLoading(false);
    
            if (responseData.error) {
                return setRegisterError(responseData);
            }
            navigate('/login'); 
        } catch (error) {
            console.error("An error occurred during registration:", error);
            setRegisterError({ error: true, message: "An unexpected error occurred." });
        }
    }, [registerInfoMedicalPersonnel, navigate]);

    const updateRegisterInfoMedicalPersonnel = useCallback((info) => {
        setRegisterInfoMedicalPersonnel(info);
    }, []);

    const RegisterMedicalFacility = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);
    
        try {
            const responseData = await postRequest(`${baseUrl}/api/v1/admin/auth/registerfacility`, registerInfoMedicalFacility);
            setIsRegisterLoading(false);
    
            if (responseData.error) {
                return setRegisterError(responseData);
            }
            navigate('/login');
        } catch (error) {
            setRegisterError({ error: true, message: "An unexpected error occurred." });
        }
    }, [registerInfoMedicalFacility, navigate]);

    const handleCityChange = (e) => {
        setRegisterInfoMedicalFacility(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                city: e.target.value
            }
        }));
    };
    
    const handleProvinceChange = (e) => {
        setRegisterInfoMedicalFacility(prevState => ({
            ...prevState,
            location: {
                ...prevState.location,
                province: e.target.value
            }
        }));
    };

    const updateRegisterInfoMedicalFacility = useCallback((info) => {
        setRegisterInfoMedicalFacility(info);
    }, []);

    const fetchHospitals = useCallback(async () => {
        try {
            const response = await getRequest(`${baseUrl}/api/v1/facility/list`);
            if (!response.error) {
                setHospitals(response.data.data); // Correctly accessing the nested array
            } else {
                console.error('Failed to fetch hospitals:', response.message);
            }
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    }, [baseUrl]);

    useEffect(() => {
        // Fetch hospitals when the component mounts
        fetchHospitals();
    }, [fetchHospitals]);


    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
    
        try {
            const response = await postRequest(`${baseUrl}/api/v1/auth/login`, loginInfo, {
                credentials: 'include'
            });
    
            if (response.ok) {
                const responseData = await response.json(); // Read the response body
                console.log("Login response data:", responseData); // Log the response data
    
                localStorage.setItem("User", JSON.stringify(responseData));
                setUser(responseData);
                navigate('/chat');
            } else {
                const errorData = await response.json(); // Read the response body for error details
                setLoginError(errorData);
                console.error("Login failed:", errorData);
            }
        } catch (error) {
            console.error("An error occurred during login:", error);
            setLoginError({ error: true, message: "An unexpected error occurred." });
        } finally {
            setIsLoginLoading(false);
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
                registerUserByAdmin,
                registerInfoByAdmin,
                updateRegisterInfoByAdmin,
                registerInfoMedicalPersonnel,
                updateRegisterInfoMedicalPersonnel,
                registerMedicalPersonnel,
                updateRegisterInfoMedicalFacility,
                registerInfoMedicalFacility,
                RegisterMedicalFacility,
                hospitals,
                handleCityChange,
                handleProvinceChange,
                fetchHospitals,
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};
