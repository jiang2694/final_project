import React, { useState, useContext, useRef } from 'react';
import { Context } from 'Store';

import { Button, Toast, Form } from '@douyinfe/semi-ui';
import server from 'server';

const ReviewModule = (props) => {
  const formRef = useRef();
  const [state, dispatch] = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (value) => {
    setLoading(true);
    const params = {
      ...value,
      sitter_id: props.sitterId,
    };
    server
      .reviewSave(params)
      .then((res) => {
        console.log(res);
        if (res.data?.success) {
          resetForm();
          props.onCreated?.(res.data.data);
          Toast.success({ content: 'Review created', duration: 5 });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const showSign = () => {
    dispatch({ type: 'SHOW_SIGNIN' });
  };

  const resetForm = () => {
    formRef?.current?.formApi.reset?.();
  };

  return (
    <>
      <h4 className='mt-6 mb-4'>Write a review</h4>
      {!!state.user?.id ? (
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Form.Rating
            field='rating'
            label='Rating'
            rules={[{ required: true, message: 'Required' }]}
            disabled={loading}
          />
          <Form.TextArea
            field='body'
            showCounter={true}
            label='Comment'
            maxLength={250}
            maxCount={250}
            rules={[
              { required: true, message: 'Required' },
              { type: 'string', message: 'Invalid comment' },
              {
                validator: (rule, value) => String(value).length >= 15,
                message: 'At least 15 characters',
              },
            ]}
            disabled={loading}
          />
          <Button
            size='large'
            theme='solid'
            className='mt-3'
            type='secondary'
            htmlType='submit'
            loading={loading}
          >
            Submit
          </Button>
        </Form>
      ) : (
        <div>
          <div>Please Sign Up or Sign In to write a review</div>
          <Button
            size='large'
            theme='solid'
            className='mt-3'
            htmlType='submit'
            onClick={showSign}
          >
            Sign Up / Sign In
          </Button>
        </div>
      )}
    </>
  );
};

export default ReviewModule;
