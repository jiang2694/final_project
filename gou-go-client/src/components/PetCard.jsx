import React, { useState, useContext } from 'react';
import { Context } from 'Store';
import { Button, Card, Tag, Modal, Toast } from '@douyinfe/semi-ui';
import { IconDeleteStroked, IconMale, IconFemale } from '@douyinfe/semi-icons';
import { useNavigate } from 'react-router-dom';
import server from 'server';

const PetCard = (props) => {
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [deleteV, setDeleteV] = useState(false);
  const navigate = useNavigate();
  let pet = props.pet || {};

  const onDelete = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setDeleteV(true);
  };

  const doDelete = () => {
    const _id = pet.id;
    setDeleteV(false);
    setLoading(true);
    server
      .petDelete(_id)
      .then((res) => {
        if (res.data?.success) {
          props.onDeleted?.(_id);
          Toast.success({ content: `${pet.name} deleted!` });
          dispatch({
            type: 'SET_USER',
            payload: {
              ...state.user,
              pets: state.user.pets.filter((x) => x.id !== _id),
            },
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => setLoading(false));
  };

  const toDetail = () => {
    if (!loading) {
      navigate(`/pet/${pet.id}`, { state: { pet: pet } });
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
            <div className='flex-1'>
              <h6 className='text-dark'>{pet.name}</h6>
              <div className='mt-1 text-muted'>{pet.breed}</div>
              <div className='d-flex f-wrap aic mt-3'>
                {pet.sex === 1 && (
                  <IconMale className='mr-2' style={{ color: '#5792f7' }} />
                )}
                {pet.sex === 2 && (
                  <IconFemale className='mr-2' style={{ color: '#f757d2' }} />
                )}
                <Tag className='mr-2'>{pet.age} Yrs</Tag>
                <Tag>{pet.weight} lb</Tag>
              </div>
            </div>
            {props.showDelete !== false && (
              <Button
                size='small'
                theme='borderless'
                type='danger'
                icon={<IconDeleteStroked />}
                onClick={onDelete}
                loading={loading}
              ></Button>
            )}
          </div>
        </Card>
      </div>
      <Modal
        className='glass'
        title='Delete pet'
        visible={deleteV}
        onOk={doDelete}
        onCancel={() => setDeleteV(false)}
        closeOnEsc={true}
        okText='Delete'
      >
        <div>
          Do you want to delete <strong>{pet.name}</strong> ?
        </div>

        <div className='mt-2'>
          Bookings related to <strong>{pet.name}</strong> will be modified or
          canceled accordingly.
        </div>
      </Modal>
    </>
  );
};

export default PetCard;
