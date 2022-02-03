import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <div style={style}>
            <LinkContainer to='/login'>
              <Nav.Link>Sign In </Nav.Link>
            </LinkContainer>
            <span>
              <i className='fas fa-angle-right text-primary'></i>
            </span>
          </div>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <div style={style}>
            <LinkContainer to='/shipping'>
              <Nav.Link>Shipping</Nav.Link>
            </LinkContainer>
            <span>
              <i className='fas fa-angle-right text-primary'></i>
            </span>
          </div>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <div style={style}>
            <LinkContainer to='/payment'>
              <Nav.Link>Payment</Nav.Link>
            </LinkContainer>
            <span>
              <i className='fas fa-angle-right text-primary'></i>
            </span>
          </div>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  )
}

const style = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export default CheckoutSteps
