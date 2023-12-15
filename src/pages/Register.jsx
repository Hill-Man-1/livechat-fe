// Register.js
import { useContext } from 'react';
import { Button, Alert, Form, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import "../index.css"

const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);

    return (
        <Form onSubmit={registerUser} className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Col md={6} lg={4}>
                <div className="register-form-container">
                    <Stack gap={3}>
                        <h2 className='text-dark text-center'>Register</h2>
                        <Form.Control type='text' placeholder='First Name' onChange={(e) => updateRegisterInfo({...registerInfo, firstname: e.target.value})} />
                        <Form.Control type='text' placeholder='Last Name' onChange={(e) => updateRegisterInfo({...registerInfo, lastname: e.target.value})} />
                        <Form.Control type='text' placeholder='Username' onChange={(e) => updateRegisterInfo({...registerInfo, username: e.target.value})} />
                        <Form.Control type='email' placeholder='Email' onChange={(e) => updateRegisterInfo({...registerInfo, email: e.target.value})} />
                        <Form.Control type='password' placeholder='Password' onChange={(e) => updateRegisterInfo({...registerInfo, password: e.target.value})} />
                        <Form.Control type='password' placeholder='Confirm Password' onChange={(e) => updateRegisterInfo({...registerInfo, confirmpassword: e.target.value})} />
                        <Button className="register-form-button" type='submit'>
                            {isRegisterLoading ? "Creating Your Account..." : "Register"}
                        </Button>
                        {registerError?.error && (
                            <Alert variant='danger'>
                                <p>{registerError?.message}</p>
                            </Alert>
                        )}
                    </Stack>
                </div>
            </Col>
        </Form>
    );
};

export default Register;
