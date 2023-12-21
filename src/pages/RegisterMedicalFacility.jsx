// Register.js
import { useContext } from 'react';
import { Button, Alert, Form, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import "../index.css";

const RegisterMedicalFacility = () => {
    const { RegisterMedicalFacility, registerError, isRegisterLoading, updateRegisterInfoMedicalFacility, registerInfoMedicalFacility, handleCityChange, handleProvinceChange } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await RegisterMedicalFacility(e);
    };
    
    return (
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            {/* Form fields go here */}
            <Col md={6} lg={4}>
                <div className="register-form-container">
                    <Stack gap={3}>
                        <h2 className='text-dark text-center'>Register Facility</h2>
                        <Form.Control type='text' placeholder='Name' onChange={(e) => updateRegisterInfoMedicalFacility({...registerInfoMedicalFacility, name: e.target.value})} />
                        <Form.Control type='email' placeholder='Email' onChange={(e) => updateRegisterInfoMedicalFacility({...registerInfoMedicalFacility, email: e.target.value})} />
                        <Form.Control type='text' placeholder='Address' onChange={(e) => updateRegisterInfoMedicalFacility({...registerInfoMedicalFacility, address: e.target.value})} />
                        <Form.Control type='text' placeholder='Contact' onChange={(e) => updateRegisterInfoMedicalFacility({...registerInfoMedicalFacility, contact: e.target.value})} />
                        <Form.Control type='text' placeholder='City' onChange={handleCityChange} />
                        <Form.Control type='text' placeholder='Province' onChange={handleProvinceChange} />


                        <Button className="register-form-button" type='submit'>
                            {isRegisterLoading ? "Creating Your Account..." : "Register"}
                        </Button>
                        {/* Error Message */}
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

export default RegisterMedicalFacility;
