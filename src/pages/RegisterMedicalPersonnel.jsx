// RegisterMedicalPersonnel.js
import { useContext } from 'react';
import { Button, Alert, Form, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import "../index.css"

const RegisterMedicalPersonnel = () => {
    const {
        updateRegisterInfoMedicalPersonnel,
        registerMedicalPersonnel,
        registerError,
        isRegisterLoading,
        registerInfoMedicalPersonnel,
        hospitals, // Add hospitals from AuthContext
    } = useContext(AuthContext);

    return (
        <Form onSubmit={registerMedicalPersonnel} className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Col md={6} lg={4}>
                <div className="register-form-container">
                    <Stack gap={3}>
                        <h2 className='text-dark text-center'>Register Personnel</h2>
                        <Form.Control type='text' placeholder='First Name' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, first_name: e.target.value})} />
                        <Form.Control type='text' placeholder='Last Name' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, last_name: e.target.value})} />
                        <Form.Control type='text' placeholder='Username' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, username: e.target.value})} />
                        <Form.Control type='email' placeholder='Email' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, email: e.target.value})} />
                        <Form.Control type='password' placeholder='Password' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, password: e.target.value})} />
                        <Form.Control type='password' placeholder='Confirm Password' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, confirmpassword: e.target.value})} />
                        <Form.Control as='select' onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, hospital: e.target.value})}>
                            <option value='' disabled>Select Hospital</option>
                            {hospitals.map(hospital => (
                                <option key={hospital._id} value={hospital.name}>{hospital.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Select 
                            onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, specialization    : e.target.value})}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Specializations</option>
                            <option value="Administration">Administration</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Dermatology">Dermatology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Emergency Medicine">Emergency Medicine</option>
                            <option value="Internal Medicine">Internal Medicine</option>
                            <option value="Surgery">Surgery</option>
                            <option value="Radiology">Radiology</option>
                            <option value="Ophthalmology">Ophthalmology</option>
                            <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                            <option value="Psychiatry">Psychiatry</option>
                            <option value="Anesthesiology">Anesthesiology</option>
                            <option value="Oncology">Urology</option>
                            <option value="Gastroenterology">Gastroenterology</option>
                            <option value="Endocrinology">Endocrinology</option>
                        </Form.Select>
                        
                        <Form.Select 
                            onChange={(e) => updateRegisterInfoMedicalPersonnel({...registerInfoMedicalPersonnel, role: e.target.value})}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="medical_admin">Medical Admin</option>
                            <option value="doctor">Doctor</option>
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

export default RegisterMedicalPersonnel;
