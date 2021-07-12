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