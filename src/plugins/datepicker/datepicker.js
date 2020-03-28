import "./datepicker.scss";
import DatepickerUI from "./DatepickerUI";

class Datepicker {
  constructor() {
    this.init();
  }
  attachOutput(element) {
    this.output = element;
    this.initShowBtn();
  }
  init() {
    this.ui = new DatepickerUI(this);
  }
  selectDate(date) {
    this.selected = date;
    if (this.output) {
      this.output.value = this.dateFormat(date);
    }
  }
  dateFormat(date) {
    let year = date.getFullYear().toString();
    let month = (1 + date.getMonth()).toString();
    if (month.length < 2) month = "0" + month;
    let day = date.getDate().toString();
    if (day.length < 2) day = "0" + day;
    return year + "." + month + "." + day;
  }
  show() {
    this.ui.instance.classList.toggle(`${this.ui.baseClass}_active`);
  }
  initShowBtn() {
    this.output.addEventListener("click", e => {
      this.chooseElementPosition(this.ui.instance, this.output, 10, -16);
      this.show();
    });
  }
  chooseElementPosition(
    targetElement,
    element,
    yOffset = 0,
    xOffset = 0,
    targetYFrom = "top",
    targetXFrom = "left",
    elementYFrom = "bottom",
    elementXFrom = "left"
  ) {
    const elementPosition = element.getBoundingClientRect(element);
    targetElement.style.position = "absolute";
    targetElement.style.zIndex = 10;
    targetElement.style[targetYFrom] =
      elementPosition[elementYFrom] + pageYOffset + yOffset + "px";
    targetElement.style[targetXFrom] =
      elementPosition[elementXFrom] + pageXOffset + xOffset + "px";
  }
}
document.querySelectorAll(".field_date .field__input").forEach(input => {
  new Datepicker().attachOutput(input);
});
