import React from 'react'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Container,
  Card,
  Image,
  ListGroup,
  ListGroupItem,
  Button,
} from 'react-bootstrap'
import '../styles/OrderCard.css'
import Message from './Message'

// TODO: Estimated Delivery Message localStorage paypal payment result
const OrderCard = ({ order }) => {
  return (
    <div className='order-card'>
      <Card className='my-2'>
        <Container>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <Row>
                <Col md={10}>
                  <Row className='my-1'>
                    <Col md={3} className='ml-2'>
                      <Row>
                        <h3>ORDER DATE</h3>
                      </Row>
                      <Row>
                        <span>{order.createdAt.substring(0, 10)}</span>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <h3>ORDER NUMBER</h3>
                      </Row>
                      <Row>
                        <Link to={`/order/${order._id}`}>
                          <span>{order._id}</span>
                        </Link>
                      </Row>
                    </Col>
                    <Col md={3}>
                      <Row>
                        <h3>ORDER TOTAL</h3>
                      </Row>
                      <Row>
                        <strong>${order.totalPrice}</strong>
                      </Row>
                    </Col>
                  </Row>
                  <Row className='my-1'>
                    <Col md={3}>
                      <Row>
                        <Link to={`/product/${order.orderItems[0]['product']}`}>
                          <Image
                            src={order.orderItems[0]['image']}
                            fluid
                            rounded
                          />
                        </Link>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        <Link to={`/product/${order.orderItems[0]['product']}`}>
                          <h4>{order.orderItems[0]['name']}</h4>
                        </Link>
                      </Row>

                      <Row>
                        {!order.isPaid ? (
                          <Message variant='warning'>
                            This order hasn't been paid yet. Go to{' '}
                            <Link to={`/order/${order._id}`}>Pay</Link>
                          </Message>
                        ) : order.isPaid && !order.isSent ? (
                          <Message>Order waiting to be shipped</Message>
                        ) : order.isPaid &&
                          order.isSent &&
                          !order.isDelivered ? (
                          <Message variant='primary'>
                            Estimated Delivery{' '}
                            {new Date(Date.now()).toUTCString()}
                          </Message>
                        ) : (
                          <Message variant='success'>
                            Delivered on{' '}
                            {new Date(order.deliveredAt)
                              .toUTCString()
                              .slice(0, -3)}
                          </Message>
                        )}
                        {/* {!isDelivered ? (
                        <Message variant='danger'>
                          Item has not been sent
                        </Message>
                      ) : (
                        <Message variant='primary'>
                          Estimated Delivery{' '}
                          {new Date(Date.now()).toUTCString()}
                        </Message>
                      )} */}
                      </Row>
                    </Col>
                    <Col md={3}>
                      <Row>
                        <span>ITEM PRICE:</span>
                      </Row>
                      <Row>
                        <span>
                          $
                          {order.orderItems[0]['price'] *
                            order.orderItems[0]['qty']}
                        </span>
                      </Row>
                      <Row className='mt-2'>
                        <span>
                          Paid:{' '}
                          {order.isPaid ? (
                            <i className='fa fa-check text-success'></i>
                          ) : (
                            <i className='fa-solid fa-xmark text-warning'></i>
                          )}
                        </span>
                      </Row>
                      <Row>
                        <span>
                          Delivered:{' '}
                          {!order.isSent && !order.isDelivered
                            ? 'not sent'
                            : order.isSent && order.isDelivered
                            ? 'on its way'
                            : order.isSent && order.isDelivered
                            ? 'delivered'
                            : ''}
                        </span>
                      </Row>
                    </Col>
                  </Row>
                  <Row className='my-1'>
                    <Col md={3}></Col>
                    <Col md={9}>
                      {order.isSent ? (
                        <>
                          <i className='fas fa-info-circle text-primary'></i>{' '}
                          This item has been sent
                        </>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Col>
                <Col md={2}>
                  <Button
                    className='my-1'
                    variant='primary'
                    style={{ width: '100%', borderRadius: '0%' }}
                  >
                    Retun item
                  </Button>
                  <Button
                    className='my-1'
                    variant='outline-primary'
                    style={{ width: '100%', borderRadius: '0%' }}
                  >
                    Add to cart
                  </Button>
                  <Button
                    variant='outline-primary'
                    style={{ width: '100%', borderRadius: '0%' }}
                  >
                    Leave review
                  </Button>
                  <Button
                    className='my-1'
                    variant='outline-primary'
                    style={{ width: '100%', borderRadius: '0%' }}
                  >
                    Contact Us
                  </Button>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Container>
      </Card>
    </div>
  )
}

export default OrderCard
