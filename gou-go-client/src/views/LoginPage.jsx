import React, { useState, useContext } from 'react';
import { Context } from 'Store';
import { Button, Form, Card, Toast } from '@douyinfe/semi-ui';
import { IconMailStroked, IconKeyStroked } from '@douyinfe/semi-icons';
// reactstrap components
// import { CardBody, Container, Row, Col } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import server from 'server';

import background from 'assets/img/dog1.jpg';

const LoginPage = (props) => {
  const navigate = useNavigate();

  const [state, dispatch] = useContext(Context);

  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    console.log(values);
    setLoading(true);
    server
      .login({
        email: values.email,
        password: values.password,
        save: values.save,
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          dispatch({ type: 'SET_USER', payload: res.data.data });
          navigate(-1);
          Toast.success({
            content: 'Signed in',
            duration: 5,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response && e.response.status === 401) {
          Toast.error({
            content: 'Incorrect credential',
            duration: 3,
          });
        }
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className='login-page'
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <main>
        <section className='section-fullscreen'>
          <div className='login-container'>
            <Card className='login-card glass-light'>
              <Form onSubmit={(values) => handleSubmit(values)}>
                <div className='text-center mb-2 mt-3'>
                  <img
                    alt='...'
                    height={42}
                    src={require('assets/img/brand/gougo-logo.png')}
                  />
                </div>
                <Form.Input
                  label='E-mail'
                  field='email'
                  size='large'
                  prefix={<IconMailStroked />}
                  showClear
                  disabled={loading}
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'string', message: 'Invalid E-mail' },
                    {
                      validator: (rule, value) => {
                        var re = /\S+@\S+\.\S+/;
                        return re.test(value);
                      },
                      message: 'Invalid E-mail',
                    },
                  ]}
                ></Form.Input>
                <Form.Input
                  label='Password'
                  field='password'
                  mode='password'
                  size='large'
                  prefix={<IconKeyStroked />}
                  showClear
                  disabled={loading}
                  rules={[
                    { required: true, message: 'Required' },
                    { type: 'string', message: 'Invalid Password' },
                    {
                      validator: (rule, value) => value.length >= 6,
                      message: 'Invalid Password',
                    },
                  ]}
                ></Form.Input>
                <div className='d-flex aic lh-1'>
                  <Form.Switch
                    field='save'
                    noLabel={true}
                    initValue={true}
                  ></Form.Switch>
                  <span className='ml-2'>Remember</span>
                </div>
                <div className='text-center mt-4'>
                  <Button
                    size='large'
                    theme='solid'
                    htmlType='submit'
                    loading={loading}
                  >
                    Sign in
                  </Button>
                </div>
                <div className='text-center mt-4'>
                  <Link to='/register'>
                    <Button
                      size='large'
                      theme='borderless'
                      htmlType='submit'
                      loading={loading}
                      style={{ color: 'var(--semi-color-text-2' }}
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </Form>
            </Card>

            {/* <a
              className='text-light'
              href='#pablo'
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>

            <a
              className='text-light'
              href='#pablo'
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
