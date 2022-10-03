import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Spin, Tag, Row, Col, Button, Toast, Modal } from '@douyinfe/semi-ui';
import server from 'server';
import moment from 'moment';

import SitterCard from 'components/SitterCard';
import PetCard from 'components/PetCard';

const BookingPage = () => {
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [deleteV, setDeleteV] = useState(false);
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || {});
  const { id } = useParams();
  const getBooking = () => {
    server
      .getBooking(id)
      .then((res) => {
        if (res.data?.success) {
          setBooking(res.data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDelete = () => {
    setDeleteV(false);
    setLoading(true);
    const _id = booking.id;
    server
      .bookingDelete(_id)
      .then((res) => {
        if (res.data?.success) {
          navigate('/profile');
          Toast.success({ content: `Booking deleted!` });
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

  if (!booking.id) {
    return (
      <div className='fullscreen d-flex aic jcc'>
        <Spin size='large' />
      </div>
    );
  }

  let bookingTime = moment(booking.time).format('YYYY-MM-DD hh:mm A');
  let bookingDuration = booking.duration
    ? booking.duration < 60
      ? `${booking.duration} Mins`
      : `${booking.duration / 60} Hr${booking.duration === 60 ? '' : 's'}`
    : '';
  return (
    <main className='booking-page'>
      <img src={booking.sitter.img_url} alt='' className='booking-feature' />
      <div className='container mt-4'>
        <div className='text-center'>
          <h2 className='mb-2'>{bookingTime}</h2>
          <div className='booking-price mb-2'>
            ${(booking.price / 100).toFixed(2)}
          </div>
          <Tag size='large' style={{ fontSize: '1.2em' }}>
            {bookingDuration}
          </Tag>
        </div>
        <Row className='mt-6'>
          <Col md={12}>
            <h3>Sitter</h3>
            <div className='pr-md-6 pt-3'>
              <SitterCard sitter={booking.sitter}></SitterCard>
            </div>
          </Col>
          <Col md={12}>
            <h3>Pets</h3>
            <div className='pt-3'>
              {booking.pets.map((pet) => (
                <PetCard pet={pet} showDelete={false} key={pet.id} />
              ))}
            </div>
          </Col>
        </Row>
        <div className='mt-6 pb-12 text-center'>
          <Button
            theme='borderless'
            type='danger'
            onClick={onDelete}
            loading={loading}
          >
            Cancel
          </Button>
        </div>
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
          Do you want to cancel this booking on <strong>{bookingTime}</strong> ?
        </div>
      </Modal>
    </main>
  );
};

export default BookingPage;
