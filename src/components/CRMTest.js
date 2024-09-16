import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';

const CRMTest = () => {
  const functions = getFunctions(app);
  const addUser = httpsCallable(functions, 'addUser');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAddUser = async () => {
    try {
      const result = await addUser({ email: userEmail, password: userPassword });
      setMessage(result.data.message);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div>
      <h2>CRM Add User Test</h2>
      <input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
      <button onClick={handleAddUser}>Add User</button>
      <p>{message}</p>
    </div>
  );
};

export default CRMTest;
