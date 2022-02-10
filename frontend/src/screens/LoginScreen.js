import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login } from '../actions/userActions'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const redirect = searchParams.get('redirect')
    ? searchParams.get('redirect')
    : ''

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  useEffect(() => {
    if (userInfo && redirect === '/') {
      navigate('/')
    } else if (userInfo) {
      navigate(`/${redirect}`)
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <h1>Sign In</h1>
      <Form onSubmit={(e) => submitHandler(e)}>
        <Form.Group controlId='email' className='mb-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId='password' className='mb-3'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Form.Label>Password</Form.Label>
            <Form.Text className='text-muted'>
              <Link to='/forgotpassword'>Forgot password?</Link>
            </Form.Text>
          </div>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' varaint='primary' style={{ width: '100%' }}>
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Create an account.
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
