const getCardTemplate = (title, subscriberCount, description, blogID) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="card mt-4">
        <div class="card-body" id="blog-card-${blogID}">
            <h4>${title}</h4>
            <div class="card-subtitle text-muted mb-2">${subscriberCount} subscribers</div>
            <div class="card-text mb-2">${description}</div>
            <div>
                <a href="/my-posts/?blogID=${blogID}" class="btn btn-info mt-2">View Blog</a>
                <a id="edit-btn-${blogID}" class="btn btn-warning mt-2">Edit</a>
                <a onclick="deleteBlog(${blogID})" class="btn btn-danger mt-2">Delete</a>
            </div>
        </div>
    </div>
    `;
  return card;
};

const getFormTemplate = (blogID, description) => {
  const form = document.createElement("form");
  form.innerHTML = `
  <form id="edit-blog-form-${blogID}">
				<div class="card mt-4">
					<div class="card-body">
						<div class="form-group">
							<label for="description">Description</label>
							<input type="text" class="form-control" id="description-${blogID}" name="description"
								value="${description}">
							<button type="submit" class="btn btn-primary">Save</button>
						</div>
					</div>
				</div>
			</form>
  `;
  return form;
};

const editBlog = (blogID, oldDescription) => {
  console.log("edit blog called with params:", blogID);
  let form = getFormTemplate(blogID, oldDescription);

  form.addEventListener("submit", (event) => {
    console.log("submit");
    const description = document.getElementById(`description-${blogID}`).value;
    console.log("body", {
      id: blogID,
      description: description
    });
    event.preventDefault();
    fetch('/api/blogs', {
      method: "PUT",
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        id: blogID,
        description: description
      })
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then((body) => {
        console.log(body);
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  appendCard(`blog-card-${blogID}`, form);
};

const deleteBlog = (blogID) => {
  fetch('/api/blogs', {
    method: "DELETE",
    headers: new Headers({
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ id: blogID })
  }).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText)
    }
    else {
      location.reload();
    }
  })
};

function unSubscribeClicked(event) {
  const subscribeButtonId = event.target.id;
  const blogId = event.target.id.split('#')[1];

  console.log('UnSubscribe clicked', blogId);

  postUnSubscribeToBlogById(blogId)
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        return;
      }
      location.reload();

    }).catch((err) => {
      console.log(err);
      alert('Unsubscribe Failed');
    });
}

//function to append element to the element with the id specified
const appendCard = (id, element) => {
  let container = document.getElementById(id);
  container.appendChild(element);
};

// Get the blogs from the server
window.onload = function () {
  console.log("onload");
  document.forms["new-blog-form"].addEventListener("submit", (event) => {
    console.log("submit");
    event.preventDefault();
    fetch('/api/blogs/', {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      }),
      body: new URLSearchParams(new FormData(event.target)),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(resp.statusText);
        }
        return resp.json();
      })
      .then((body) => {
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  });


  let blogsEndpoint = "/api/blogs/my-blogs";
  fetch(blogsEndpoint, {
    headers: new Headers({
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status == 401) {
          document.location.href = "/login";
        }
      } else {
        return response.json();
      }
    })
    .then((json) => {
      // check if the json is empty
      if (json.length === 0) {
        console.log("No blogs found");
        return;
      }
      document.getElementById("empty-placeholder").style.display = "none";
      json.forEach((blog) => {
        let owner = blog.owner;
        let title = owner + "'s blog";
        let subscriberCount = blog.subscriberCount;
        let description = blog.description;

        let element = getCardTemplate(
          title,
          subscriberCount,
          description,
          blog.id,
        );

        document.getElementById("blog-list").appendChild(element);
        document.getElementById(`edit-btn-${blog.id}`).onclick = () => {
          editBlog(blog.id, description);
        }
      });
    });
};
