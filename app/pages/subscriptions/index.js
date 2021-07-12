const getCardTemplate = (title, subscriberCount, description, blogID) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="card mt-4">
        <div class="card-body">
            <h4>${title}</h4>
            <div class="card-subtitle text-muted mb-2">${subscriberCount} subscribers</div>
            <div class="card-text mb-2">${description}</div>
            <div>
                <a href="/posts/?blogID=${blogID}" class="btn btn-info mt-2">Read more</a>
                <a id="subscribe-btn-#${blogID}" onclick="unSubscribeClicked(event)" class="btn btn-danger mt-2">Unsubscribe</a>
            </div>
        </div>
    </div>
    `;
  return card;
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
  let blogsEndpoint = "/api/subscriptions";
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

        console.log({subscribed: blog.subscribed});

        let element = getCardTemplate(
          title,
          subscriberCount,
          description,
          blog.id,
        );

        document.getElementById("blog-list").appendChild(element);
      });
    });
};
