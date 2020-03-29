import "./rangeSlider.scss";

function changeValue(outputElement, value) {
  if (outputElement) {
    outputElement.value = value;
  }
}
function initSlider(slider, input) {
  function slide(event) {
    event.preventDefault();

    let shiftX = event.clientX - controller.getBoundingClientRect().left;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(event) {
      let newLeft =
        event.clientX - shiftX - slider.getBoundingClientRect().left;

      if (newLeft < 0) {
        newLeft = 0;
      }
      let rightEdge = slider.offsetWidth - controller.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      controller.style.left = newLeft + "px";
      changeValue(input, newLeft);
    }

    function onMouseUp() {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  }
  const controller = slider.querySelector(".range-slider__controller");
  controller.addEventListener("mousedown", slide);
}
document.querySelectorAll(".range-slider").forEach(rangeSlider => {
  const slider = rangeSlider.querySelector(".range-slider__slider");
  const input = rangeSlider.querySelector(".range-slider__input");
  initSlider(slider, input);
});
