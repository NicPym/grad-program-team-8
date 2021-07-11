window.onload = async function () {

    const params = new URLSearchParams(window.location.search);
    const last_segment = window.location.pathname.split('/').pop();

    if (last_segment === "add" && params.has("blogID")) {

        document.getElementById("create-edit-post-title").innerHTML = "New Post";
        localStorage.setItem('doingPostCreate', true);
        localStorage.setItem('doingPostEdit', false);

    } else if (last_segment === "edit" && params.has("postID")) {
        document.getElementById("create-edit-post-title").innerHTML = "Edit Post";
        localStorage.setItem('doingPostEdit', true);
        localStorage.setItem('doingPostCreate', false);

    } else {
        window.location.href = "/blogs";
    }

}