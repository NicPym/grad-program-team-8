window.onload = async function () {

    const params = new URLSearchParams(window.location.search);
    const last_segment = window.location.pathname.split('/').pop();

    if (last_segment === "add" && params.has("blogID")) {

        document.getElementById("create-edit-post-title").innerHTML = "New Post";
        localStorage.setItem('doingPostCreate', true);
        localStorage.setItem('doingPostEdit', false);
        localStorage.setItem('create-post-for-blog-id', params.get('blogID'));

    } else if (last_segment === "edit" && params.has("postID")) {
        document.getElementById("create-edit-post-title").innerHTML = "Edit Post";
        localStorage.setItem('doingPostEdit', true);
        localStorage.setItem('doingPostCreate', false);
        localStorage.setItem('edit-post-with-id', params.get('postID'));

        getBlogPostById(params.get('postID'))
          .then(async (res) => {

            const data = await res.json();

            document.getElementById("blog-post-title").value = data.title;
            document.getElementById("blog-post-description").innerHTML = data.description;
            document.getElementById("blog-post-markdown").innerHTML = data.text;
          }).catch((err) => {
            console.log(err);
          });
    } else {
        window.location.href = "/blogs";
    }
}

document.forms["blog-post-form"].addEventListener("submit", (event) => {
    event.preventDefault();

    if (localStorage.getItem('doingPostCreate') === "true") {

        fetch(`/api/blogs/${localStorage.getItem('create-post-for-blog-id')}/posts`, {
            method: "POST",
            body: new URLSearchParams(new FormData(event.target)),
            headers: new Headers({
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(res.statusText);
              }
              alert("Post Create Successful");
              return res.json();
            })
            .then((body) => {
              console.log(body);
              window.history.back();
            })
            .catch((error) => {
              alert("Post Create Failed");
              console.error(error);
            });

    } else if (localStorage.getItem('doingPostEdit') === "true") {

        const formData = new FormData(event.target);
        formData.append('id', localStorage.getItem('edit-post-with-id'));

        fetch(`/api/posts/`, {
            method: "PUT",
            body: new URLSearchParams(formData),
            headers: new Headers({
              'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(res.statusText);
              }
              alert("Save Successful");
              return res.json();
            })
            .then((body) => {
              console.log(body);
              window.history.back();
            })
            .catch((error) => {
              alert("Save Failed");
              console.error(error);
            });
    }
});