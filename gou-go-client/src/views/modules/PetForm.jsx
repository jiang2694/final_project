import React from 'react';
import { Button, Form } from '@douyinfe/semi-ui';
export const PetForm = (props) => {
  const BREEDS = [
    'Labrador Retriever',
    'French Bulldog',
    'German Shepherd',
    'Golden Retriever',
    'English Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Other',
  ];
  return (
    <Form onSubmit={props.onSubmit}>
      <Form.Input
        field='name'
        label="Pet's name"
        rules={[{ required: true, message: 'Required' }]}
        initValue={props?.pet?.name}
      />
      <div className='d-flex'>
        <Form.Select
          field='age'
          label='Age'
          fieldClassName='flex-1'
          className='w-100'
          disabled={props.loading}
          rules={[{ required: true, message: 'Required' }]}
          initValue={props?.pet?.age || 1}
        >
          {[...Array(29)].map((x, i) => {
            return (
              <Form.Select.Option value={i + 1} key={i + 1}>
                {i + 1}
              </Form.Select.Option>
            );
          })}
        </Form.Select>
        <Form.Select
          field='breed'
          label='Breed'
          fieldClassName='flex-2'
          className='w-100'
          fieldStyle={{ marginLeft: '12px' }}
          disabled={props.loading}
          rules={[{ required: true, message: 'Required' }]}
          initValue={props?.pet?.breed}
        >
          {BREEDS.map((breed, i) => {
            return (
              <Form.Select.Option value={breed} key={i}>
                {breed}
              </Form.Select.Option>
            );
          })}
        </Form.Select>
      </div>
      <div className='d-flex'>
        <Form.Select
          field='sex'
          label='Gender'
          fieldClassName='flex-1'
          className='w-100'
          disabled={props.loading}
          rules={[{ required: true, message: 'Required' }]}
          initValue={props?.pet?.sex}
        >
          <Form.Select.Option value={1}>Male</Form.Select.Option>
          <Form.Select.Option value={2}>Female</Form.Select.Option>
        </Form.Select>
        <Form.InputNumber
          fieldClassName='flex-2'
          className='w-100'
          fieldStyle={{ marginLeft: '12px' }}
          innerButtons
          field='weight'
          label='Weight (lb)'
          disabled={props.loading}
          rules={[{ required: true, message: 'Required' }]}
          initValue={props?.pet?.weight}
        />
      </div>
      <div className='text-center mt-4'>
        <Button
          size='large'
          theme='solid'
          htmlType='submit'
          loading={props.loading}
        >
          {props.pet?.id ? 'Save' : 'Add'}
        </Button>
        {!!props.pet?.id && (
          <Button
            className='ml-4'
            size='large'
            onClick={() => props?.onCancel?.()}
            disabled={props.loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
};
