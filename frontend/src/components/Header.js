import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap'
import Notification from '../components/Notification'
import { logout } from '../actions/userActions'
import { showLogoutNotification } from '../actions/notificationActions'
import SearchBox from './SearchBox'

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const notification = useSelector((state) => state.notification)
  const { showLogout } = notification

  const logoutHandler = () => {
    dispatch(logout())
    dispatch(showLogoutNotification())
  }
  return (
    <header>
      <Notification
        color={'success'}
        message={'You have successfully logged out!'}
        show={showLogout}
      />
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>PROSHOP</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
            <Nav className='ms-auto'>
              <LinkContainer to='/cart' style={{ position: 'relative' }}>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                  {cartItems.length === 0 ? (
                    ''
                  ) : (
                    <Badge pill bg='danger' style={badgeStyle}>
                      <span style={{ fontSize: '12px' }}>
                        {cartItems.length}
                      </span>
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link href='/login'>
                    <i className='fas fa-user'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

const badgeStyle = {
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  width: '3px',
  fontWeight: 'bold',
  top: '-3px',
  left: '51px',
  opacity: '0.9',
}

export default Header
