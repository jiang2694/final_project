import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from 'Store';

import {
  IconUserCircleStroked,
  IconGridStroked,
  IconExit,
} from '@douyinfe/semi-icons';
import { Nav, Button, Dropdown, Toast } from '@douyinfe/semi-ui';

const GougoNavbar = (props) => {
  const [state, dispatch] = useContext(Context);

  const onSignOut = () => {
    dispatch({ type: 'SIGNOUT', payload: {} });
    Toast.success({
      content: 'Signed out',
      duration: 5,
    });
    // navigate('/');
  };

  return (
    <>
      <div className='nav-container'>
        <Nav mode='horizontal' defaultSelectedKeys={['Home']}>
          <Nav.Header>
            <Link to={`/`}>
              <img
                alt='...'
                height={42}
                src={require('assets/img/brand/gougo-logo.png')}
              />
            </Link>
          </Nav.Header>

          <Nav.Footer>
            {state.user && state.user.id ? (
              <>
                <Dropdown
                  trigger={'hover'}
                  position={'bottomLeft'}
                  render={
                    <Dropdown.Menu>
                      <Link to={`/profile`}>
                        <Dropdown.Item icon={<IconGridStroked />}>
                          Dashboard
                        </Dropdown.Item>
                      </Link>
                      {/* <Dropdown.Item icon={<IconServerStroked />}>
                        Bookings
                      </Dropdown.Item> */}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={onSignOut} icon={<IconExit />}>
                        Sign Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Button
                    icon={<IconUserCircleStroked />}
                    size='large'
                    style={{
                      color: 'var(--semi-color-text-2)',
                    }}
                    theme='borderless'
                  >
                    {state.user.first_name}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <>
                {/* <Link to={'signin'}> */}

                <Button
                  theme='borderless'
                  style={{ color: 'var(--semi-color-text-2)' }}
                  size='large'
                  onClick={() => {
                    dispatch({ type: 'SHOW_SIGNIN' });
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className='ml-2'
                  size='large'
                  theme='solid'
                  onClick={() => {
                    dispatch({ type: 'SHOW_SIGNUP' });
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Nav.Footer>
        </Nav>
      </div>
      {/* <div className='nav-spacer'></div> */}
    </>
  );
};

export default GougoNavbar;
