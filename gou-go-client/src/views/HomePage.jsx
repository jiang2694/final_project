import React, { useState, useEffect } from 'react';
import server from 'server';
import SitterCard from 'components/SitterCard';
import SideFilterModule from './modules/SideFilterModule';

const HomePage = (props) => {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSitters();
  }, []);

  const getSitters = (params) => {
    server
      .getSitters(params)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setSitters(res.data.data);
          setLoading(false);
        }
      })
      .catch((e) => console.log(e));
  };

  return (
    <main className='padded bg-gray'>
      <div className='container wider'>
        <div className='side-filter-layout'>
          <div className='side-filter-container'>
            <div className='side-filter'>
              <SideFilterModule
                initialValue={{
                  price_min: 0,
                  price_max: 15000,
                  weight: null,
                  per_day: null,
                }}
                onChange={getSitters}
              />
            </div>
          </div>
          <div className='content my-3'>
            <h2 className='mb-4'>Pet Sitters</h2>
            {sitters.length ? (
              sitters.map((sitter, i) => {
                return <SitterCard sitter={sitter} key={i} />;
              })
            ) : loading ? (
              [...Array(10)].map((x, i) => {
                return <SitterCard key={i} loading />;
              })
            ) : (
              <div>No result</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
