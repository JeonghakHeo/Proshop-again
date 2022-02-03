import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderActions'
// import OrderCard from '../components/OrderCard'

const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  // console.log(orders)
  useEffect(() => {
    // Not logged in
    if (!userInfo) {
      navigate('/login')
    } else {
      // No details
      if (!user || !user.name) {
        dispatch({ type: USER_DETAILS_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [userInfo, navigate, dispatch, user, orders])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }
  // let neededItems = []
  // const getNeededItems = (orders) => {
  //   let cardItems = {}
  //   if (orders) {
  //     console.log(orders)
  //     orders.map((order) => {
  //       cardItems.orderDate = order.createdAt
  //       cardItems.orderId = order._id
  //       cardItems.totalPrice = order.totalPrice
  //       console.log(order.orderItems.length)

  //       for (let i = 0; i < order.orderItems.length; i++) {
  //         cardItems.productId = order.orderItems[i].product
  //         cardItems.image = order.orderItems[i].image
  //         cardItems.productName = order.orderItems[i].name
  //         cardItems.productPrice = order.orderItems[i].price
  //         cardItems.qty = order.orderItems[i].qty
  //       }

  //       // neededItems.productId = order.product
  //       // neededItems.image = order.image
  //       // neededItems.productName = order.name
  //       // neededItems.productPrice = order.price
  //       // neededItems.qty = order.qty

  //       // neededItems.push(
  //       //   {
  //       //     orderDate: order.createdAt,
  //       //   },
  //       //   { orderId: order._id },
  //       //   { totalPrice: order.totalPrice }
  //       // )
  //       // order.orderItems.map((order) => {
  //       //   neededItems.push(
  //       //     { productId: order.product },
  //       //     { image: order.image },
  //       //     { productName: order.name },
  //       //     { produdctPrice: order.price },
  //       //     { qty: order.qty }
  //       //   )
  //       // })
  //     })
  //   }
  //   neededItems.push(cardItems)
  //   return neededItems
  // }
  // getNeededItems(orders)
  // console.log('neededItems: ', neededItems)

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={(e) => submitHandler(e)}>
          <Form.Group controlId='name' className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

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
            <Form.Label>Change Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Current password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='confirmPassword' className='mb-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button type='submit' varaint='primary'>
            Update
          </Button>
        </Form>
      </Col>

      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : orders.length === 0 ? (
          <Message>Your order is empty</Message>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm text-center'
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='light' className='btn-md'>
                        DETAILS
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen

/* 
  <Col md={9}>
    <h2>My Orders</h2>
      ** here **
    </Col>

   
*/

/* {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : orders.length === 0 ? (
          <Message>Your order is empty</Message>
        ) : (
          orders.map((order) => (
            <div key={Math.random()}>
              <OrderCard order={order} />
            </div>
          ))
        )} */
