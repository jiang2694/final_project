import React, { useState } from 'react';
import { Button, Card, Tag, Modal, Toast } from '@douyinfe/semi-ui';
import { IconDeleteStroked } from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import server from 'server';
import moment from 'moment';

export const BookingCard = (props) => {
  const [loading, setLoading] = useState(false);
  const [deleteV, setDeleteV] = useState(false);
  const navigate = useNavigate();
  let booking = props.booking || {};
  let bookingTime = moment(booking.time).format('YYYY-MM-DD hh:mm A');
  let bookingDuration = booking.duration
    ? booking.duration < 60
      ? `${booking.duration} Mins`
      : `${booking.duration / 60} Hr${booking.duration === 60 ? '' : 's'}`
    : '';
  const onDelete = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDeleteV(true);
  };

  const doDelete = () => {
    const _id = booking.id;
    setDeleteV(false);
    setLoading(true);
    server
      .bookingDelete(_id)
      .then((res) => {
        console.log(res);
        if (res.data?.success) {
          props.onDeleted?.(_id);
          Toast.success({ content: `Booking deleted!` });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => setLoading(false));
  };

  const toDetail = () => {
    if (!loading) {
      navigate(`/booking/${booking.id}`, { state: { booking: booking } });
    }
  };
  return (
    <>
      <div className={loading ? '' : 'clickable'} onClick={() => toDetail()}>
        <Card
          className='mb-4'
          bodyStyle={{ padding: '12px' }}
          onClick={() => {}}
        >
          <div className='d-flex aic'>
            <div className='booking-card-img mr-3'>
              <div className='img-wrapper'>
                <img src={booking.sitter?.img_url} alt='' />
              </div>
            </div>
            <div className='flex-1'>
              <h6 className='text-dark'>
                {bookingTime}
                <Tag className='ml-2' color='blue'>
                  {bookingDuration}
                </Tag>
              </h6>
              <div className='mt-1 text-muted'>
                {booking?.sitter?.first_name}
              </div>
              <div className='d-flex f-wrap aic mt-3'>
                {booking.pets?.map((pet) => (
                  <Tag className='mr-2' key={pet.id}>
                    {pet.name}
                  </Tag>
                ))}
              </div>

              <div className='booking-card-price mt-2'>
                ${(booking.price / 100).toFixed(2)}
              </div>
            </div>
            <Button
              size='small'
              theme='borderless'
              type='danger'
              icon={<IconDeleteStroked />}
              onClick={onDelete}
              loading={loading}
            ></Button>
          </div>
        </Card>
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
    </>
  );
};
