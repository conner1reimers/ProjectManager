export function simpleGet(url, body) {  
    const response = fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });

    return response;
}

export function simplePost(url, body) { 
  const response = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
  });

  return response;
}