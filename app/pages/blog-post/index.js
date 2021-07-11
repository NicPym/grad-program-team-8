window.localStorage.setItem("blog-post-id", "1"); // setItem onClick a post in the /posts page

const blogId = window.localStorage.getItem("blog-post-id");

async function getBlogPostById(blogId) {
  const response = await fetch(`/api/posts/${blogId}`, {
    method: "GET",
  });
  return response;
}

getBlogPostById(blogId).then(async (res) => {
  // if (!res.ok) {
  //   window.location.href = `/not-found`;
  //   return;
  // }

  const data = await res.json();
  console.log(data);

  document.getElementById("blog-title").innerHTML = data.title;
  document.getElementById("blog-description").innerHTML = data.description;
  document.getElementById("blog-markdown").innerHTML = data.text;
});
