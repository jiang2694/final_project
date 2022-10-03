import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from 'Store';
import {
  Form,
  Tag,
  Button,
  Slider,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
} from '@douyinfe/semi-ui';
import {
  IconPlusCircleStroked,
  IconUserCircleStroked,
  IconFemale,
  IconMale,
} from '@douyinfe/semi-icons';

const SideFilterModule = (props) => {
  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  const [state, dispatch] = useContext(Context);
  const [formData, setFormData] = useState(
    props.initialValue ?? {
      price_min: 0,
      price_max: 15000,
      weight: null,
      per_day: null,
    }
  );
  const [currentUser, setCurrentUser] = useState(state.user?.id);
  const onFormChanged = (data) => {
    if (!shallowEqual(data, formData)) {
      setFormData(data);
      props.onChange?.(data);
    }
  };
  const onPriceChange = (value) => {
    console.log(value);
    onFormChanged({
      ...formData,
      price_min: value[0] * 100,
      price_max: value[1] * 100,
    });
  };
  const onPetsChange = (val) => {
    if (val.length && state.user?.pets?.length) {
      const weights = state.user.pets
        .filter((pet) => val.indexOf(pet.id) !== -1)
        .map((pet) => pet.weight);

      if (weights.length) {
        let maxWeight = Math.min(...weights);
        onFormChanged({
          ...formData,
          weight: maxWeight || null,
        });
      } else {
        onFormChanged({
          ...formData,
          weight: null,
        });
      }
    } else {
      onFormChanged({
        ...formData,
        weight: null,
      });
    }
  };
  const onPerDayChange = (e) => {
    onFormChanged({
      ...formData,
      per_day: e.target.value || null,
    });
  };

  if (state.user.id !== currentUser) {
    console.log('user changed');
    setCurrentUser(state.user.id);
    onPetsChange([]);
  }

  return (
    <>
      <h3 className='mt-2'>Filter</h3>
      <hr />
      <Form>
        <Form.Label className='mt-3 mb-2'>How many walks per day</Form.Label>
        <RadioGroup
          mode='advanced'
          className='full-radio'
          type='button'
          buttonSize='large'
          onChange={onPerDayChange}
        >
          <Radio value={1}>1</Radio>
          <Radio value={2}>2</Radio>
          <Radio value={3}>3</Radio>
          <Radio value={4}>4</Radio>
          <Radio value={5}>5</Radio>
        </RadioGroup>
        <Form.Label className='mt-6'>Price per hour</Form.Label>
        <Slider
          onAfterChange={onPriceChange}
          defaultValue={[0, 150]}
          range
          min={0}
          max={150}
        ></Slider>
        <Form.Label className='mt-6 mb-2'>Choose pets</Form.Label>

        {!!state.user?.pets?.length ? (
          <CheckboxGroup
            onChange={onPetsChange}
            type='card'
            direction='vertical'
            field='pets'
            defaultValue={[]}
          >
            {state.user.pets.map((pet) => {
              return (
                <Checkbox
                  value={pet.id}
                  key={pet.id}
                  // extra={pet.breed}
                  style={{ marginBottom: '8px' }}
                >
                  <span className='mr-2'>{pet.name}</span>

                  <Tag className='mr-2'>
                    {pet.weight} lb · {pet.age} Yrs
                  </Tag>
                  {pet.sex === 1 && <IconMale style={{ color: '#5792f7' }} />}
                  {pet.sex === 2 && <IconFemale style={{ color: '#f757d2' }} />}
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        ) : (
          <div className='mt-2 mb-6'>
            <small>You don't have a pet yet</small>
          </div>
        )}
        <div className='mt-3'>
          {state.user?.id ? (
            <Button
              block
              icon={<IconPlusCircleStroked />}
              size='large'
              onClick={() => dispatch({ type: 'SHOW_PET' })}
            >
              Add Pet
            </Button>
          ) : (
            <Button
              block
              icon={<IconUserCircleStroked />}
              onClick={() => {
                dispatch({ type: 'SHOW_SIGNIN' });
              }}
              size='large'
            >
              Sign in / Sign up
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default SideFilterModule;
