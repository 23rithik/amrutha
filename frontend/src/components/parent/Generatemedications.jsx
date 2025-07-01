import React from 'react';
import ParentHeader1 from './ParentHeader1';
import ParentFooter from './ParentFooter1';

const Generatemedications = () => {
  return (
    <>
      <ParentHeader1 />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <div style={{ flex: 1, padding: '20px', textAlign: 'center', marginTop: '80px' }}>
          <h1>Generate Medications</h1>
          <p>This feature is under development. Stay tuned for updates!</p>
        </div>
        <ParentFooter />
      </div>
    </>
  );
};

export default Generatemedications;
