const getCardTemplate = (
  title,
  subscriberCount,
  description,
  blogID,
  subscribeFunc,
  subscribeText
) => {
  const card = document.createElement("div");
  const className =
    subscribeText === "Subscribe"
      ? "btn btn-success mt-2"
      : "btn btn-danger mt-2";
  card.innerHTML = `
    <div class="card mt-4">
        <div class="card-body">
            <h4>${title}</h4>
            <div class="card-subtitle text-muted mb-2">${subscriberCount} subscribers</div>
            <div class="card-text mb-2">${description}</div>
            <div>
                <a href="/posts/?blogID=${blogID}" class="btn btn-info mt-2">Read more</a>
                <a id="subscribe-btn-#${blogID}" onclick="${subscribeFunc}(event)" class="${className}">${subscribeText}</a>
            </div>
        </div>
    </div>
    `;
  return card;
};

function subscribeClicked(event) {
  const subscribeButtonId = event.target.id;
  const blogId = event.target.id.split("#")[1];

  postSubscribeToBlogById(blogId)
    .then((res) => {
      if (!res.ok) {
        return;
      }

      event.target.innerHTML = "Unsubscribe";
      event.target.className = "btn btn-danger mt-2";
      document.getElementById(subscribeButtonId).onclick = unSubscribeClicked;
    })
    .catch((err) => {
      console.log(err);
    });
}

function unSubscribeClicked(event) {
  const subscribeButtonId = event.target.id;
  const blogId = event.target.id.split("#")[1];

  console.log("UnSubscribe clicked", blogId);

  postUnSubscribeToBlogById(blogId)
    .then((res) => {
      if (!res.ok) {
        return;
      }

      event.target.innerHTML = "Subscribe";
      event.target.className = "btn btn-success mt-2";

      document.getElementById(subscribeButtonId).onclick = subscribeClicked;
    })
    .catch((err) => {
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
      if (json.length === 0) {
        return;
      }
      document.getElementById("empty-placeholder").style.display = "none";
      json.forEach((blog) => {
        let owner = blog.owner;
        let title = owner + "'s blog";
        let subscriberCount = blog.subscriberCount;
        let description = blog.description;
        const subscribeFunc = blog.subscribed
          ? "unSubscribeClicked"
          : "subscribeClicked";
        const subscribeText = blog.subscribed ? "Unsubscribe" : "Subscribe";

        let element = getCardTemplate(
          title,
          subscriberCount,
          description,
          blog.id,
          subscribeFunc,
          subscribeText
        );

        document.getElementById("blog-list").appendChild(element);
      });
    });
};
