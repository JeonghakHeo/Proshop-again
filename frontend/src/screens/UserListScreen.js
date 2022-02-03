import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Modal, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserListScreen = () => {
  const navigate = useNavigate()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  const dispatch = useDispatch()

  // Modal
  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)
  const [showModal, setShowModal] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate('/login')
    }
  }, [dispatch, userInfo, navigate, successDelete])

  const deleteHandler = (id, username) => {
    if (username === confirmName) {
      dispatch(deleteUser(id))
      setShowModal(false)
    }
  }
  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
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
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className='align-middle'>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={handleShow}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>

                  <Form>
                    <Form.Group className='mb-3' controlId='deleteUser'>
                      <Modal
                        show={showModal}
                        onHide={handleClose}
                        style={{ top: '10%' }}
                      >
                        <Modal.Header className='justify-content-center'>
                          <Modal.Title>
                            <i
                              className='fas fa-exclamation-circle text-warning'
                              style={{ fontSize: '5rem' }}
                            ></i>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className='text-center'>
                          Are you sure you really want to delete this user?
                          <div style={{ width: '83%', marginLeft: '38px' }}>
                            <Form.Label
                              style={{ textAlign: 'left', marginTop: '0.7rem' }}
                            >
                              To delete <strong>{user.name}</strong>, type{' '}
                              <strong>{user.name}</strong>
                            </Form.Label>
                            <Form.Control
                              type='text'
                              placeholder={user.name}
                              onChange={(e) => setConfirmName(e.target.value)}
                            />
                            <Form.Text className='text-muted'>
                              <i className='fas fa-info-circle text-danger'></i>{' '}
                              This action is not reversible
                            </Form.Text>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant='secondary' onClick={handleClose}>
                            Close
                          </Button>
                          <Button
                            variant='danger'
                            disabled={confirmName !== user.name}
                            onClick={() => deleteHandler(user._id, user.name)}
                          >
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </Form.Group>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
export default UserListScreen
