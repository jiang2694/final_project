import React, { useState, useEffect, useContext } from 'react';

import { Context } from 'Store';

import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  Rating,
  Button,
  SideSheet,
  Form,
  Row,
  Col,
  Toast,
  Tag,
} from '@douyinfe/semi-ui';
import { IconPrizeStroked } from '@douyinfe/semi-icons';
import ReviewCard from 'components/ReviewCard';
import ReviewModule from './modules/ReviewModule';
import server from 'server';
import moment from 'moment';
import * as dateFns from 'date-fns';

const SitterPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, dispatch] = useContext(Context);
  const [sitter, setSitter] = useState(location.state?.sitter || {});
  // const [loading, setLoading] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookPrice, setBookPrice] = useState(0);
  // const [bookFormData, setFormData] = useState(0);

  let { id } = useParams();

  let _goodPets = [];
  let _badPets = [];
  if (!!state.user?.pets?.length && sitter.dog_weight) {
    _goodPets = state.user.pets.filter(
      (pet) => pet.weight <= sitter.dog_weight
    );
    _badPets = state.user.pets.filter((pet) => pet.weight > sitter.dog_weight);
  }

  const calcBookPrice = (formVal) => {
    console.log(formVal);
    let price =
      ((formVal.duration || 0) *
        (sitter.price || 0) *
        (formVal.pets?.length || 0)) /
      60;
    setBookPrice(price);
  };
  // const setDisableDate = () => {
  const disabledDate = (date) => {
    return moment(date).endOf('D').isBefore(moment());
  };
  const disabledTime = (date) => {
    let disabledHours = [0, 1, 2, 3, 4, 5, 21, 22, 23];
    if (dateFns.isToday(date)) {
      disabledHours = [
        ...disabledHours,
        ...Array(moment(date.hour).get('hour') + 1).keys(),
      ];
    }
    return { disabledHours: () => disabledHours };
  };

  const getSitter = () => {
    console.log('getSitters');
    if (id) {
      server
        .getSitter(id)
        .then((res) => {
          if (res.data.success) {
            setSitter(res.data.data);
          }
        })
        .catch((e) => {
          Toast.error({
            content: String(e),
            duration: 5,
          });
        });
    }
  };

  const toggleBookVisible = () => {
    setBookPrice(0);
    setBookVisible(!bookVisible);
  };

  const onReviewCreated = (review) => {
    setSitter({
      ...sitter,
      reviews: [...sitter.reviews, review],
    });
  };

  const onReviewDeleted = (review_id) => {
    setSitter({
      ...sitter,
      reviews: sitter.reviews.filter((review) => review.id !== review_id),
    });
  };

  const onBookSubmit = (value) => {
    setBookLoading(true);
    server
      .bookSave({ ...value, sitter_id: sitter.id })
      .then((res) => {
        if (res.data?.success) {
          navigate(`/booking/${res.data.data.id}`, {
            state: { booking: res.data.data },
          });
          Toast.success({ content: 'Booking created successfully!' });
        }
        server
          .login()
          .then((res) => {
            if (res.data && res.data.success && res.data.data) {
              dispatch({ type: 'SET_USER', payload: res.data.data });
            }
          })
          .catch((e) => console.log(e));
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        setBookLoading(false);
      });
  };

  useEffect(() => {
    getSitter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className='sitter-page padded'>
      <div className='container px-0'>
        {!!sitter?.id ? (
          <Row gutter={{ md: 16 }}>
            <Col md={8}>
              <div className='img-wrapper sitter-feature'>
                <img src={sitter.img_url} alt='' />
              </div>
            </Col>
            <Col md={16}>
              <div className='pa-3 mt-4'>
                <h2>
                  {sitter.first_name} {sitter.last_name}
                </h2>
                <div>{sitter.postcode}</div>
                <div className='price'>
                  <span className='amount'>
                    ${(sitter.price / 100).toFixed(2)}
                  </span>
                  <span className='unit'> / hr</span>
                </div>
                <div className='mt-2 d-flex align-items-center'>
                  <Rating
                    disabled={true}
                    allowHalf
                    defaultValue={sitter.rating}
                  />
                  <span className='ms-3 mb-1'>{sitter.rating?.toFixed(1)}</span>
                </div>
                <div className='mt-3 mb-4'>
                  <small className='bg-lighter rounded px-3 py-2 dib'>
                    {sitter.description}
                  </small>
                </div>
                <div className='d-flex f-wrap'>
                  <div className='mr-8'>
                    <h5>Dog Size</h5>
                    <div className='d-flex aic mt-1'>
                      <IconPrizeStroked className='mt-1' />
                      <span className='ml-1'>{`Up to: ${sitter.dog_weight.toFixed(
                        1
                      )} lb`}</span>
                    </div>
                  </div>
                  <div className='mr-4'>
                    <h5>Walks per day</h5>
                    <div className='d-flex aic mt-1'>
                      <IconPrizeStroked className='mt-1' />
                      <span className='ml-1'>{`Up to: ${sitter.walks_per_day}`}</span>
                    </div>
                  </div>
                </div>

                <div className='mt-6 mb-8'>
                  {state.user?.id ? (
                    <Button
                      size='large'
                      theme='solid'
                      onClick={toggleBookVisible}
                    >
                      Book Now
                    </Button>
                  ) : (
                    <Button
                      size='large'
                      theme='solid'
                      onClick={() => {
                        dispatch({ type: 'SHOW_SIGNIN' });
                      }}
                    >
                      Sign Up / Sign In to book
                    </Button>
                  )}
                </div>
                <SideSheet
                  title='Creat Booking'
                  visible={bookVisible && !!state.user?.id}
                  onCancel={toggleBookVisible}
                >
                  {/* {!!state.user?.pets?.length && ( */}
                  <Form onValueChange={calcBookPrice} onSubmit={onBookSubmit}>
                    <Form.CheckboxGroup
                      field='pets'
                      label='Select Pets'
                      disabled={bookLoading}
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      {_goodPets.map((pet) => {
                        return (
                          <Form.Checkbox
                            value={pet.id}
                            key={pet.id}
                            // style={{ marginBottom: '6px' }}
                          >
                            {pet.name}
                            <Tag className='mx-2'>{pet.weight}lb</Tag>
                          </Form.Checkbox>
                        );
                      })}
                      {_badPets.map((pet) => {
                        return (
                          <Form.Checkbox
                            disabled={true}
                            value={pet.id}
                            key={pet.id}
                            // style={{ marginBottom: '6px' }}
                          >
                            {pet.name}
                            <Tag className='mx-2'>{pet.weight}lb</Tag> Over Size
                          </Form.Checkbox>
                        );
                      })}
                    </Form.CheckboxGroup>
                    {_goodPets.length > 0 ? (
                      <>
                        <div>
                          <Form.DatePicker
                            field='time'
                            label='Choose A Time'
                            type='dateTime'
                            format='yyyy-MM-dd HH:mm'
                            disabledDate={disabledDate}
                            disabledTime={disabledTime}
                            hideDisabledOptions={true}
                            timePickerOpts={{
                              scrollItemProps: { cycled: false },
                            }}
                            disabled={bookLoading}
                            rules={[{ required: true, message: 'Required' }]}
                          ></Form.DatePicker>
                        </div>
                        <div>
                          <Form.Select
                            field='duration'
                            label='Duration'
                            disabled={bookLoading}
                            rules={[{ required: true, message: 'Required' }]}
                          >
                            <Form.Select.Option value={60}>
                              1 Hour
                            </Form.Select.Option>
                            <Form.Select.Option value={90}>
                              1.5 Hours
                            </Form.Select.Option>
                            <Form.Select.Option value={120}>
                              2 Hours
                            </Form.Select.Option>
                            <Form.Select.Option value={150}>
                              2.5 Hours
                            </Form.Select.Option>
                            <Form.Select.Option value={180}>
                              3 Hours
                            </Form.Select.Option>
                          </Form.Select>
                        </div>
                        <hr className='mt-4 mb-6' />
                        <div className='d-flex aic'>
                          <Button
                            size='large'
                            htmlType='submit'
                            loading={bookLoading}
                            theme='solid'
                            disabled={!bookPrice}
                          >
                            Book Now
                          </Button>
                          <span className='booking-price ml-2 lh-1'>
                            ${(bookPrice / 100).toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className='mb-4'>
                          You don't have a eligible pet
                        </div>
                        <Button
                          size='large'
                          onClick={() => dispatch({ type: 'SHOW_PET' })}
                          block={true}
                        >
                          Add pet
                        </Button>
                      </>
                    )}
                  </Form>
                </SideSheet>

                <hr />
                <h4 className='mt-3'>
                  Reviews ({sitter.reviews?.length || 0})
                </h4>
                <div>
                  {sitter.reviews?.map((review) => {
                    return (
                      <ReviewCard
                        review={review}
                        key={review.id}
                        onDeleted={onReviewDeleted}
                      />
                    );
                  })}
                </div>
                <ReviewModule
                  sitterId={sitter?.id}
                  onCreated={onReviewCreated}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
};

export default SitterPage;
