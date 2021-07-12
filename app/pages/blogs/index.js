const getCardTemplate = (title, subscriberCount, description, blogID, subscribeFunc, subscribeText) => {
  const card = document.createElement("div");
  card.innerHTML = `
    <div class="card mt-4">
        <div class="card-body">
            <h4>${title}</h4>
            <div class="card-subtitle text-muted mb-2">${subscriberCount} subscribers</div>
            <div class="card-text mb-2">${description}</div>
            <div>
                <a href="/posts/?blogID=${blogID}" class="btn btn-info mt-2">Read more</a>
                <a id="subscribe-btn-#${blogID}" onclick="${subscribeFunc}(event)" class="btn btn-success mt-2">${subscribeText}</a>
            </div>
        </div>
    </div>
    `;
  return card;
};

function subscribeClicked(event) {
  const subscribeButtonId = event.target.id;
  const blogId = event.target.id.split('#')[1];
  console.log('Subscribe clicked', blogId);

  postSubscribeToBlogById(blogId)
    .then((res) => {
      console.log(res);
      if (!res.ok) {
        return;
      }

      event.target.innerHTML = 'Unsubscribe';
      document.getElementById(subscribeButtonId).onclick = unSubscribeClicked;

    }).catch((err) => {
      console.log(err);
    });

}

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

      event.target.innerHTML = 'Subscribe';
      document.getElementById(subscribeButtonId).onclick = subscribeClicked;

    }).catch((err) => {
      console.log(err);
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
  let blogsEndpoint = "/api/blogs";
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
        console.log(blog);

        let owner = blog.owner;
        let title = owner + "'s blog";
        let subscriberCount = blog.subscriberCount;
        let description = blog.description;
        const subscribeFunc = blog.subscribed ? "unSubscribeClicked" : "subscribeClicked";
        const subscribeText = blog.subscribed ? "Unsubscribe" : "Subscribe";

        let element = getCardTemplate(
          title,
          subscriberCount,
          description,
          blog.id,
          subscribeFunc,
          subscribeText,
        );

        document.getElementById("blog-list").appendChild(element);
      });
    });
};
