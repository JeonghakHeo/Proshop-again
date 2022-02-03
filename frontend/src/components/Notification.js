import React, { useState } from 'react'
import { Row, Col, Toast, ToastContainer } from 'react-bootstrap'
const Notification = ({ show, color, message }) => {
  const [showNotification, setNotification] = useState(false)

  return (
    <Row>
      <Col xs={6}>
        <ToastContainer
          position='bottom-end'
          style={{ marginRight: '35px', marginBottom: '55px', zIndex: '2' }}
        >
          <Toast
            onClose={() => setNotification(false)}
            show={show}
            delay={3000}
            autohide
            bg={color}
          >
            <Toast.Header closeButton={false}>
              <i
                className='far fa-check-circle'
                style={{ color: '#28a745', marginRight: '5px' }}
              ></i>
              <strong className='me-auto'>Notification</strong>
              <small>Now</small>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Col>
    </Row>
  )
}

export default Notification
