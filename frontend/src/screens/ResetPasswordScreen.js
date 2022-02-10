import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
  sendResetToken,
  checkToken,
  resetPassword,
} from '../actions/userActions'

const ResetPasswordScreen = () => {
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [hidePassword, setHidePassword] = useState('password')

  const userResetPassword = useSelector((state) => state.userResetPassword)
  const { loading, error, success } = userResetPassword

  const email = JSON.parse(localStorage.getItem('resetEmail'))
  const verified = JSON.parse(localStorage.getItem('verified'))

  const dispatch = useDispatch()

  const hidePasswordHandler = (e) => {
    if (hidePassword === 'password') {
      setHidePassword('')
    } else {
      setHidePassword('password')
    }
  }

  const verifyHandler = (e) => {
    e.preventDefault()
    dispatch(checkToken(verificationCode))
  }

  const resendCodeHandler = (e) => {
    e.preventDefault()
    dispatch(sendResetToken(email))
  }

  const resetHandler = (e) => {
    e.preventDefault()
    dispatch(resetPassword(verified, newPassword))
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : !verified ? (
        <>
          <FormContainer>
            <h1>Reset Your Password</h1>
            <h4>
              We have sent you a verification code to your email. Enter the code
              to reset your password. Please be aware, the code is vaild only
              for 10 minutes.
            </h4>
            <Form onSubmit={(e) => verifyHandler(e)}>
              <Form.Group controlId='name' className='my-3'>
                <Form.Label>Verification Code</Form.Label>
                <Form.Control
                  type='verificationCode'
                  placeholder='Enter code'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </Form.Group>
              <Button type='submit' varaint='primary' style={{ width: '100%' }}>
                Submit
              </Button>
            </Form>

            <Row className='py-3'>
              <Col>
                Didn't get the code?{' '}
                <Button
                  type='submit'
                  varaint='primary'
                  style={{ width: '100%' }}
                  onClick={(e) => resendCodeHandler(e)}
                >
                  Resend Code
                </Button>
              </Col>
            </Row>
          </FormContainer>
        </>
      ) : verified && !success ? (
        <FormContainer>
          <h1>Reset Your Password</h1>
          <h4>Great! You are verified. Create a new password.</h4>
          <Form onSubmit={(e) => resetHandler(e)}>
            <Form.Group controlId='name' className='my-3'>
              <Form.Label>Reset Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={hidePassword}
                  placeholder='Enter new password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <OverlayTrigger
                  overlay={
                    <Tooltip delay={{ show: 10, hide: 300 }}>
                      {hidePassword === 'password'
                        ? 'Show password'
                        : 'Hide password'}
                    </Tooltip>
                  }
                >
                  <Button
                    variant='secondary'
                    onClick={(e) => hidePasswordHandler(e)}
                  >
                    {hidePassword === 'password' ? (
                      <i className='fa fa-eye'></i>
                    ) : (
                      <i className='fa fa-eye-slash'></i>
                    )}
                  </Button>
                </OverlayTrigger>
              </InputGroup>
            </Form.Group>
            <Button type='submit' varaint='primary' style={{ width: '100%' }}>
              Change Password
            </Button>
          </Form>
        </FormContainer>
      ) : success ? (
        <Container>
          <h2>
            You password is now reset. Please login with the new password.
          </h2>
        </Container>
      ) : (
        <>
          <Message>{error}</Message>
        </>
      )}
    </>
  )
}

export default ResetPasswordScreen
