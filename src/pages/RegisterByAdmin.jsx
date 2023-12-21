// Register.js
import { useContext } from 'react';
import { Button, Alert, Form, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import "../index.css"

const RegisterByAdmin = () => {
    const { updateRegisterInfoByAdmin, registerUserByAdmin, registerError, isRegisterLoading, registerInfoByAdmin } = useContext(AuthContext);

    return (
        <Form onSubmit={registerUserByAdmin} className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Col md={6} lg={4}>
                <div className="register-form-container">
                    <Stack gap={3}>
                        <h2 className='text-dark text-center'>Register By Admin</h2>
                        <Form.Control type='text' placeholder='First Name' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, first_name: e.target.value})} />
                        <Form.Control type='text' placeholder='Last Name' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, last_name: e.target.value})} />
                        <Form.Control type='text' placeholder='Username' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, username: e.target.value})} />
                        <Form.Control type='email' placeholder='Email' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, email: e.target.value})} />
                        <Form.Control type='password' placeholder='Password' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, password: e.target.value})} />
                        <Form.Control type='password' placeholder='Confirm Password' onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, confirmpassword: e.target.value})} />
                        <Form.Select 
                            onChange={(e) => updateRegisterInfoByAdmin({...registerInfoByAdmin, role: e.target.value})}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="staff">Staff</option>
                            <option value="patient">Patient</option>
                        
                        </Form.Select>

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

export default RegisterByAdmin;
