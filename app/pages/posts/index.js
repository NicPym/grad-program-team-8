window.localStorage.setItem("blog-id", "1"); // setItem onClick a post in the /posts page

const blogId = window.localStorage.getItem("blog-id");

async function getBlogPostById(blogId) {
  const response = await fetch(`/blogs/${blogId}/posts`, {
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

  //   document.getElementById("post-title").innerHTML = data.title;
  //   document.getElementById("post-description").innerHTML = data.description;
  //   document.getElementById("post-markdown").innerHTML = data.text;
});
