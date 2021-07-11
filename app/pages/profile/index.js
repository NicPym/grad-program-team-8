function openEditAbout() {
  let aboutMarkdown = document.getElementById("markdown");
  let aboutParagraph = document.getElementById("about");
  let editBtn = document.getElementById("open-btn");
  let markDownBtns = document.getElementById("markdown-btns");

  aboutMarkdown.style.display = "block";
  markDownBtns.style.display = "block";
  editBtn.style.display = "none";
  aboutParagraph.style.display = "none";
}

function closeEditAbout(action) {
  let aboutMarkdown = document.getElementById("markdown");
  let aboutParagraph = document.getElementById("about");
  let editBtn = document.getElementById("open-btn");
  let markDownBtns = document.getElementById("markdown-btns");

  if (action.localeCompare("save") == 0)
    aboutParagraph.innerHTML = aboutMarkdown.value;
  aboutMarkdown.style.display = "none";
  markDownBtns.style.display = "none";
  aboutParagraph.style.display = "block";
  editBtn.style.display = "block";
}
