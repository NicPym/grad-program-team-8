const params = new URLSearchParams(window.location.search);
const postId = params.get("postID");
async function getBlogPostById(postId) {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "GET",
  });
  return response;
}

window.onload = () => {
  console.log("onload");
  getBlogPostById(postId).then(async (res) => {
    // if (!res.ok) {
    //   window.location.href = `/not-found`;
    //   return;
    // }

    const data = await res.json();
    console.log(data);

    document.getElementById("blog-title").innerHTML = data.title;
    document.getElementById("blog-description").innerHTML = data.description;
    document.getElementById("blog-markdown").innerHTML = data.text;
  }).catch((err) => {
    console.log(err);
  });
}
