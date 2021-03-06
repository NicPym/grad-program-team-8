async function getBlogPostById(blogId) {
  const response = await fetch(`/api/blogs/${blogId}/posts`, {
    method: "GET",
  });
  return response;
}

const getCardTemplate = (title, createdAt, description, id) => {
  const card = document.createElement("div");
  card.innerHTML = `
  <div class="card mt-4">
      <div class="card-body">
          <h4>${title}</h4>
          <div class="card-subtitle text-muted mb-2"> created at ${new Date(
            createdAt
          ).toLocaleTimeString()}</div>
          <div class="card-text mb-2">${description}</div>
          <div>
              <a href="/blog-post/?postID=${id}" class="btn btn-info mt-2">Read more</a>
          </div>
      </div>
  </div>
  `;
  return card;
};

//function to append element to the element with the id specified
const appendCard = (id, element) => {
  let container = document.getElementById(id);
  container.appendChild(element);
};

// Get the posts from the server
window.onload = async function () {
  // get params from the url
  const params = new URLSearchParams(window.location.search);
  if (params.has("blogID")) {
    const blogId = params.get("blogID");
    const blog = await fetch(`/api/blogs/${blogId}`, {
      method: "GET",
    });

    const posts = await fetch(`/api/blogs/${blogId}/posts`, {
      method: "GET",
    });

    const blogJSON = await blog.json();
    const postsJSON = await posts.json();

    document.getElementById(
      "blog-title"
    ).innerHTML = `${blogJSON.owner}'s Blog`;

    if (posts.length === 0) {
      return;
    }
    document.getElementById("empty-placeholder").style.display = "none";
    postsJSON.forEach((post) => {
      const card = getCardTemplate(
        post.title,
        post.createdAt,
        post.description,
        post.id
      );
      appendCard("post-list", card);
    });
  }
};
