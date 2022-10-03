import React from 'react';
import { Link } from 'react-router-dom';

import { Card, Rating, Skeleton, Space, Tag } from '@douyinfe/semi-ui';

const SitterCard = (props) => {
  if (props.loading || !props.sitter) {
    return (
      <Card className='p-3 mb-3'>
        <div className='sitter-card'>
          <div className='sitter-img-container'>
            <div className='img-wrapper'>
              <Skeleton.Image
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              {/* <img src={props.sitter.img_url} alt='sitter-avatar' /> */}
            </div>
          </div>
          <div className='sitter-content-wrapper px-3'>
            <Skeleton.Title style={{ width: '70%' }} />
            <Skeleton.Paragraph
              rows={2}
              style={{ width: '50%', marginTop: 10 }}
            />
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Link to={`/sitter/${props.sitter?.id}`} state={{ sitter: props.sitter }}>
      <Card className='p-3 mb-3'>
        <div className='sitter-card'>
          <div className='sitter-img-container'>
            <div className='img-wrapper'>
              <img src={props.sitter?.img_url} alt='sitter-avatar' />
            </div>
          </div>
          <div className='sitter-content-wrapper px-3'>
            <h4>
              {props.sitter?.first_name} {props.sitter?.last_name}
            </h4>
            <div className='mt-1'>
              <small>{props.sitter?.postcode}</small>
            </div>
            <div className='mt-2 d-flex aic f-wrap'>
              <Rating
                className='mr-1'
                size='small'
                disabled
                allowHalf
                defaultValue={props.sitter?.rating}
              />
              <span className='mb-1'>
                {props.sitter?.reviews ? props.sitter?.reviews?.length : 0}{' '}
                Reviews
              </span>
            </div>
            <Space className='my-2'>
              <Tag>Up to {props.sitter?.dog_weight}lb</Tag>
              <Tag>Max {props.sitter?.walks_per_day} walks per day</Tag>
            </Space>
            <div className='d-flex aic f-wrap'></div>
            <div>"{props.sitter?.description}"</div>
          </div>
          <div className='sitter-meta-wrapper'>
            <small>From</small>
            <div className='price'>
              ${Math.round(props.sitter?.price / 100)}
            </div>
            <small>per walk</small>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default SitterCard;
