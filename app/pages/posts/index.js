const posts = require("../../../server/routes/posts");

window.localStorage.setItem("blog-id", "1"); // setItem onClick a post in the /posts page

const blogId = window.localStorage.getItem("blog-id");

async function getBlogPostById(blogId) {
  const response = await fetch(`/blogs/${blogId}/posts`, {
    method: "GET",
  });
  return response;
}

const getCardTemplate = (title, author, description) => {
  const card = document.createElement("div"); 
  card.innerHTML = `
  <div class="card mt-4">
      <div class="card-body">
          <h4>${title}</h4>
          <div class="card-subtitle text-muted mb-2">${author} subscribers</div>
          <div class="card-text mb-2">${description}</div>
          <div>
              <button class="btn btn-info mt-2">Read more</button>
              <button class="btn btn-success mt-2">Subscribe</button>
          </div>
      </div>
  </div>
  `
  return card;
}

//function to append element to the element with the id specified
const appendCard = (id, element) => {
  let container = document.getElementById(id);
  container.appendChild(element);
}

// Get the posts from the server
window.onload = function () {
  console.log('onload');
  // get params from the url
  const params = new URLSearchParams(window.location.search);
  if (params.has("blogId")) {
    const blogId = params.get("blogId");
    console.log(blogId);
    getBlogPostById(blogId).then(response => {
      const posts = response.json();
      console.log('posts', posts);
      posts.forEach(post => {
        const card = getCardTemplate(post.ctitle, post.author, post.description);
        appendCard("post-list", card);
      });
    });
  }
  else {  
    console.log("no blogId");
  }
};
