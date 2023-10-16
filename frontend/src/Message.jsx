import React, { useEffect, useState } from 'react';

function Message() {
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => {
                setMessage(data[0] + ' ' + data[1] + ' ' + data[2]);
            });
    }, []);


  return (
    <div>
      <h1>Hello World Message</h1>
      <p>{message}</p>
    </div>
  );
}

export default Message;
