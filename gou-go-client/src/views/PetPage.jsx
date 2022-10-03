import React, { useState, useEffect, useContext } from 'react';
import { Context } from 'Store';

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Spin,
  Tag,
  Row,
  Col,
  Button,
  Toast,
  Modal,
  Empty,
  Descriptions,
} from '@douyinfe/semi-ui';
import server from 'server';
import { BookingCard } from 'components/BookingCard';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import { PetForm } from './modules/PetForm';

export const PetPage = () => {
  const [state, dispatch] = useContext(Context);

  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [deleteV, setDeleteV] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const [pet, setPet] = useState(location.state?.pet || {});
  const { id } = useParams();
  const showEdit = () => {
    setEditMode(true);
  };
  const hideEdit = () => {
    setEditMode(false);
  };
  const getPet = () => {
    server
      .getPet(id)
      .then((res) => {
        if (res.data?.success) {
          setPet(res.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDelete = () => {
    setDeleteV(false);
    setLoading(true);
    const _id = pet.id;
    server
      .petDelete(_id)
      .then((res) => {
        if (res.data?.success) {
          navigate('/profile');
          dispatch({
            type: 'SET_USER',
            payload: {
              ...state.user,
              pets: state.user.pets.filter((x) => x.id !== _id),
            },
          });
          Toast.success({ content: `Pet removed!` });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => setLoading(false));
  };

  const onDelete = (e) => {
    setDeleteV(true);
  };

  const onBookingDeleted = (id) => {
    setPet({ ...pet, bookings: pet.bookings.filter((x) => x.id !== id) });
  };

  const onSavePet = (value) => {
    const _id = pet.id;
    setLoading(true);
    server
      .petSave({ ...value, id: _id })
      .then((res) => {
        if (res.data?.success) {
          hideEdit();
          setPet(res.data.data);
          let newPets = state.user?.pets || [];
          let foundIndex = newPets.findIndex((x) => x.id === _id);
          if (foundIndex > 1) {
            newPets[foundIndex] = res.data.data;
            dispatch({
              type: 'SET_USER',
              payload: { ...state.user, pets: newPets },
            });
          }
          Toast.success('Pet saved!');
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        setLoading(false);
      });
  };
  if (!pet.id) {
    return (
      <div className='fullscreen d-flex aic jcc'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <main className='pet-page padded'>
      <div className='container mt-4'>
        <Row className='mt-6 pb-12'>
          <Col md={12} className='pr-md-6'>
            {editMode ? (
              <div className='mb-12'>
                <h3 className='mb-2'>Edit Pet</h3>
                <PetForm
                  pet={pet}
                  onSubmit={onSavePet}
                  onCancel={hideEdit}
                  loading={loading}
                />
              </div>
            ) : (
              <>
                <h3 className='mb-2'>{pet.name}</h3>
                <Tag size='large' className='mb-4'>
                  {pet.breed}
                </Tag>
                <Descriptions
                  align='left'
                  data={[
                    {
                      key: 'Age',
                      value: `${pet.age} Year${pet.age > 1 ? 's' : ''} Old`,
                    },
                    {
                      key: 'Gender',
                      value: pet.sex === 1 ? 'Male' : 'Female',
                    },
                    {
                      key: 'Weight',
                      value: pet.weight + ' lb',
                    },
                  ]}
                />
                <div className='mt-6 mb-6'>
                  <Button disabled={loading} onClick={showEdit} size='large'>
                    Edit
                  </Button>
                  <Button
                    size='large'
                    className='ml-4'
                    theme='borderless'
                    type='danger'
                    onClick={onDelete}
                    loading={loading}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Col>
          <Col md={12}>
            <h3>Bookings</h3>
            <div className='pt-3'>
              {!!pet.bookings?.length ? (
                pet.bookings?.map((booking) => (
                  <BookingCard
                    booking={booking}
                    onDeleted={onBookingDeleted}
                    key={booking.id}
                  />
                ))
              ) : (
                <div>
                  <Empty
                    image={
                      <IllustrationNoContent
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    darkModeImage={
                      <IllustrationNoContentDark
                        style={{ width: 150, height: 150 }}
                      />
                    }
                    title='No Bookings'
                  ></Empty>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        className='glass'
        title='Cancel booking'
        visible={deleteV}
        onOk={doDelete}
        onCancel={() => setDeleteV(false)}
        closeOnEsc={true}
        okText='Yes'
      >
        <div>
          Do you want to delete <strong>{pet.name}</strong> ?
        </div>

        <div className='mt-2'>
          Bookings related to <strong>{pet.name}</strong> will be modified or
          canceled accordingly.
        </div>
      </Modal>
    </main>
  );
};
