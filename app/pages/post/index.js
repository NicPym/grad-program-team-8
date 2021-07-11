let url = window.location.pathname;
let formElement = document.getElementById("form");

if (url.localeCompare("/post/add") == 0){
    formElement.setAttribute("action", "blogs/")
}
else if (url.localeCompare("/post/edit") == 0){
    // maybe the put route from the server need to take a blog ID
    // Then we'll change this action accordingly
    formElement.setAttribute("action", "blogs/")
}

console.log(url);