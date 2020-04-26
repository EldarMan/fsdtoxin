import "./checkboxList.scss";
const baseClass = "checkbox-list";
document.querySelectorAll(".checkbox-list").forEach((element) => {
  const title = document.querySelector(`.${baseClass}__title`);
  const list = document.querySelector(`.${baseClass}__list`);
  title.addEventListener("click", (e) => {
    if (list.classList.contains(`${baseClass}__list_collapsed`)) {
      list.classList.remove(`${baseClass}__list_collapsed`);
      list.classList.add(`${baseClass}__list_expanded`);
    } else {
      list.classList.remove(`${baseClass}__list_expanded`);
      list.classList.add(`${baseClass}__list_collapsed`);
    }
  });
});
