const logOut = () => {
  localStorage.clear();
  document.location.href = "/login";
};

async function getBlogPostById(postId) {
  console.log('fetching blog post', postId);
  const response = await fetch(`/api/posts/${postId}`, {
    method: "GET",
  });
  return response;
}

async function postSubscribeToBlogById(blogId) {
  const response = await fetch(`/api/blogs/${blogId}/subscribe`, {
    method: "POST",
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  });
  return response;
}

async function postUnSubscribeToBlogById(blogId) {
  const response = await fetch(`/api/blogs/${blogId}/unsubscribe`, {
    method: "POST",
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  });
  return response;
}