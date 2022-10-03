import React, { useState, useContext } from 'react';
import { Context } from 'Store';
import server from 'server';

import moment from 'moment';

import { Rating, Button, Popconfirm } from '@douyinfe/semi-ui';

const ReviewCard = (props) => {
  const review = props.review || {};
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const onDelete = () => {
    setLoading(true);
    server
      .reviewDelete(review.id)
      .then((res) => {
        console.log(res);
        if (res.data?.success) {
          props.onDeleted?.(review.id);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => setLoading(false));
  };
  return (
    <>
      <div className='review-card py-4'>
        <div className='review-img-container'>
          <div className='img-wrapper'>
            <img
              className='review-avatar'
              src={review.author_img_url}
              alt='review-avatar'
            />
          </div>
        </div>
        <div className='review-content ml-3'>
          <h6>{review.author_name}</h6>
          <div className='mb-2'>
            <Rating
              disabled
              size='small'
              allowHalf
              defaultValue={review.rating}
            />
          </div>
          <div>{review.body}</div>
          <div>
            <small className='text-muted'>
              {moment(review.created_at).format('MM-DD hh:mm A')}
            </small>
          </div>
          {state.user.id === review.user_id && (
            <div className='mt-2'>
              <Popconfirm
                title='Delete Review?'
                content='Do you want to delete this review?'
                onConfirm={onDelete}
                okText='Delete'
              >
                <Button type='danger' loading={loading}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
      </div>
      <hr className='m-0' />
    </>
  );
};

export default ReviewCard;
