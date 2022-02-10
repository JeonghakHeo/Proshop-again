import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import Notification from '../components/Notification'
import { USER_SEND_REST_PASSWORD_TOKEN_RESET } from '../constants/userConstants'
import { sendResetToken } from '../actions/userActions'
import { showEmailNotFondNotification } from '../actions/notificationActions'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const userResetPassword = useSelector((state) => state.userResetPassword)
  const { loading, error, success } = userResetPassword

  const notification = useSelector((state) => state.notification)
  const { showEmailNotFound } = notification

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(sendResetToken(email))
  }

  useEffect(() => {
    if (success) {
      navigate('/resetpassword')
      dispatch({ type: USER_SEND_REST_PASSWORD_TOKEN_RESET })
    } else if (error) {
      dispatch(showEmailNotFondNotification())
    }
  }, [dispatch, navigate, success, error])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <Notification
            color='warning'
            message='Invalid email'
            show={showEmailNotFound}
          />
          <FormContainer>
            <h1>Reset Your Password</h1>
            <h4>{error}</h4>
            <Form onSubmit={(e) => submitHandler(e)}>
              <Form.Group controlId='name' className='my-3'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button type='submit' varaint='primary' style={{ width: '100%' }}>
                Send Code
              </Button>
            </Form>
          </FormContainer>
        </>
      ) : (
        <FormContainer>
          <h1>Reset Your Password</h1>
          <h4>
            Enter your email address and we'll send you a verification code to
            help you reset your password.
          </h4>
          <Form onSubmit={(e) => submitHandler(e)}>
            <Form.Group controlId='name' className='my-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button type='submit' varaint='primary' style={{ width: '100%' }}>
              Send Code
            </Button>
          </Form>
        </FormContainer>
      )}
    </>
  )
}

export default ForgotPasswordScreen
