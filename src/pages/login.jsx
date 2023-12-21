/* eslint-disable react/no-unescaped-entities */
import { useContext } from 'react';
import { Button, Alert, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import medify from '../assets/medify.svg'
import "../index.css"

const Login = () => {
    const {
        isLoginLoading,
        loginError,
        loginUser,
        loginInfo,
        updateLoginInfo,
    } = useContext(AuthContext);

    return (
        <Form onSubmit={loginUser} className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
            <Row className="w-100 gx-0">
                <Col lg={8} md={7} className="d-flex justify-content-center">
                    <div className="register-form-container" style={{ width: '80%', maxWidth: '500px' }}>
                        <Stack gap={3}>
                            <h2 className='text-dark text-center'>Login</h2>
                            <Form.Control type='text' placeholder='Email or Username' onChange={(e) => updateLoginInfo({...loginInfo, usernameOrEmail: e.target.value})}/>
                            <Form.Control type='password' placeholder='Password' onChange={(e) => updateLoginInfo({...loginInfo, password: e.target.value})}/>
                            <Button className="register-form-button" type='submit'>
                                {isLoginLoading ? "Getting You In" : "Login"}
                            </Button>
                            {loginError?.error && (
                                <Alert variant='danger'>
                                    <p>{loginError?.message}</p>
                                </Alert>
                            )}
                        </Stack>
                    </div>
                </Col>
                <Col lg={4} md={5} className="d-flex flex-column align-items-center justify-content-center">
                    <img src={medify} alt="Medify" style={{ maxWidth: '150px', marginBottom: '20px' }} />
                    <p className="desc-prof text-dark text-center" style={{ maxWidth: '80%' }}>
                        Welcome to HaloDog! <br/> Woof Woof Woof 🐶🐶🐶.
                    </p>
                </Col>
            </Row>
        </Form>
    );
};

export default Login;
