import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { PayPalButton } from 'react-paypal-button-v2'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
  ORDER_PAY_RESET,
  ORDER_SENT_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  sentOrder,
} from '../actions/orderActions'

const OrderScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sdkReady, setSdkReady] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderSent = useSelector((state) => state.orderSent)
  const { loading: loadingSent, success: successSent } = orderSent

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const dispatch = useDispatch()

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/pay')

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }

      document.body.appendChild(script)
    }

    if (
      !order ||
      (order && order._id !== id) ||
      successPay ||
      successSent ||
      successDeliver
    ) {
      dispatch({ type: ORDER_SENT_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch({ type: ORDER_PAY_RESET })
      dispatch(getOrderDetails(id))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    order,
    id,
    successPay,
    successSent,
    successDeliver,
  ])

  const sentHandler = () => {
    dispatch(sentOrder(order))
  }
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(id, paymentResult))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <Row>
      <h1>Order {order._id}</h1>
      <Col md={8}>
        <ListGroup variant='flush'>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{' '}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            {order.isSent && !order.isDelivered ? (
              <Message>
                Shipped on {new Date(order.sentAt).toUTCString().slice(0, -3)}
              </Message>
            ) : order.isSent && order.isDelivered ? (
              <Message variant='success'>
                Delivered on{' '}
                {new Date(order.deliveredAt).toUTCString().slice(0, -3)}
              </Message>
            ) : (
              <Message variant='danger'>Order Not Shipped</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item variant='flush'>
            <h2>Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant='success'>
                Paid on {new Date(order.paidAt).toUTCString().slice(0, -3)}
              </Message>
            ) : (
              <Message variant='danger'>Order Not Paid</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>

                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Summary</h2>
              <small>*Free shipping for total items over $100</small>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items: </Col>
                <Col>${order.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping: </Col>
                <Col>${order.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax: </Col>
                <Col>${order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total: </Col>
                <Col>
                  <strong>${order.totalPrice}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            {!order.isPaid && (
              <ListGroup.Item>
                {loadingPay && <Loader />}
                {!sdkReady ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    onSuccess={successPaymentHandler}
                  />
                )}
              </ListGroup.Item>
            )}
            {loadingSent && <Loader />}
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isSent && (
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-block'
                  style={{ width: '100%' }}
                  onClick={sentHandler}
                >
                  Mark As Sent
                </Button>
              </ListGroup.Item>
            )}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              order.isSent &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-block'
                    style={{ width: '100%' }}
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default OrderScreen
