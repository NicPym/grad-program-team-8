const params = new URLSearchParams(window.location.search);
const postId = params.get("postID");

window.onload = () => {
  getBlogPostById(postId)
    .then(async (res) => {
      const data = await res.json();

      document.getElementById("blog-title").innerHTML = data.title;
      document.getElementById("blog-description").innerHTML = data.description;
      document.getElementById("blog-markdown").innerHTML = data.text;
    })
    .catch((err) => {
      console.log(err);
    });
};
