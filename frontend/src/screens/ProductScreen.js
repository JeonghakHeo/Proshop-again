import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Container,
  Modal,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Notification from '../components/Notification'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import {
  showAddedNotification,
  showAlreadyNotification,
} from '../actions/notificationActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = () => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const [showModal, setShowModal] = useState(false)

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const { id } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { error, product } = productDetails

  const productCreateReview = useSelector((state) => state.productCreateReview)
  const { success: successProductReview, error: errorProductReview } =
    productCreateReview

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const notification = useSelector((state) => state.notification)
  const { showAdded, showAlready } = notification

  const isItemInCart = cartItems.filter((item) => item.product === product._id)

  console.log(isItemInCart)
  useEffect(() => {
    if (successProductReview) {
      window.alert('Review Submitted!')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    dispatch(listProductDetails(id))
  }, [dispatch, id, successProductReview])

  const addToCartHandler = () => {
    handleShow()
    dispatch(addToCart(product._id, qty))
    if (isItemInCart.length !== 0) {
      dispatch(showAlreadyNotification())
    }
    if (isItemInCart.length === 0) {
      dispatch(showAddedNotification())
    }
    // navigate(`/cart/${id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(id, { rating, comment }))
  }

  return (
    <>
      {isItemInCart.length === 0 ? (
        <Notification
          color={'success'}
          message={'Item has been added to Cart'}
          show={showAdded}
        />
      ) : isItemInCart.length !== 0 ? (
        <Notification
          color={'warning'}
          message={'Item already in Cart'}
          show={showAlready}
        />
      ) : (
        ''
      )}

      <Link to='/' className='btn btn-light my-3'>
        Go Back
      </Link>
      {!product._id || product._id !== id ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} />
            </Col>

            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  {
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  }
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Stock:</Col>
                      <Col>
                        {product.countInStock <= 0
                          ? 'Out Of Stock'
                          : 'In Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1}>{x + 1}</option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row>
                      <Button
                        onClick={addToCartHandler}
                        className='btn-block'
                        type='button'
                        style={{ width: '100%' }}
                        disabled={product.countInStock === 0}
                      >
                        Add To Cart
                      </Button>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a customer review</h2>
                  {errorProductReview && (
                    <Message>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          className='mb-3'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>select...</option>
                          <option value={1}>1 - poor</option>
                          <option value={2}>2 - Fair</option>
                          <option value={3}>3 - Good</option>
                          <option value={4}>4 - Very Good</option>
                          <option value={5}>5 - Excellent</option>
                        </Form.Control>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          className='mb-3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button type='submit'>Submit</Button>
                      </Form.Group>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Modal show={showModal} onHide={handleClose} style={{ top: '10%' }}>
              <Modal.Header className='justify-content-center'>
                <Modal.Title>{qty} item added to Cart</Modal.Title>
              </Modal.Header>
              <Modal.Body className='show-grid'>
                <Container>
                  <Row>
                    <Col md={4}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%' }}
                      ></Image>
                    </Col>
                    <Col md={8}>
                      <Row>
                        <strong>{product.name}</strong>
                      </Row>
                      <Row>
                        <Col md={6}>Price:</Col>
                        <Col md={6}>${product.price * qty}</Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' onClick={() => navigate('/shipping')}>
                  {cartItems.length > 1
                    ? `Checkout ${cartItems.length} items `
                    : `Checkout ${cartItems.length} item`}
                </Button>
                <Button variant='info' onClick={() => navigate('/cart')}>
                  Go to Cart
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
