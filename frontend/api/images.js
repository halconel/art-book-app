export const fetchImages = data => {
  const params = new URLSearchParams(data);
  return fetch(`/api/images?${params}`).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};
