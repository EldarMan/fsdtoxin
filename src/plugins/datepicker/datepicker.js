import "./datepicker.scss";

function addPluginCloserToBlock(
  block,
  plugin,
  pluginActiveClass,
  toggler,
  togglerActiveClass
) {
  block.addEventListener("click", e => {
    if (
      plugin.classList.contains(pluginActiveClass) &&
      e.target !== plugin &&
      !plugin.contains(e.target) &&
      e.target !== toggler &&
      !toggler.contains(e.target)
    ) {
      toggler.classList.remove(togglerActiveClass);
      plugin.classList.remove(pluginActiveClass);
    }
  });
}

function chooseElementPosition(
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

function initdatepicker(inputElement) {
  const datepicker = document.createElement("div");
  datepicker.classList.add("datepicker");
  datepicker.innerHTML = `
    <div class="datepicker__header">
      <div class="datepicker__btn datepicker__btn_prev"></div>
      <div class="datepicker__title"></div>
      <div class="datepicker__btn datepicker__btn_next"></div>
    </div>
    <div class="datepicker__grid"></div>
    <div class="datepicker__footer">
      <div class="datepicker__clear">Очистить</div>
      <div class="datepicker__accept">Применить</div>
    </div>
  `;
  inputElement.addEventListener("click", e => {
    chooseElementPosition(datepicker, inputElement, 10);
    datepicker.classList.toggle("datepicker_active");
  });
  document.body.appendChild(datepicker);

  function getLastDateOfMonth(year, month) {
    let date = new Date(year, month + 1, 0);
    return date.getDate();
  }
  function getFirstDayOfMonth(year, month) {
    const date = new Date(year, month, 1);
    return date.getDay();
  }

  function dateFormat(date) {
    let year = date.getFullYear().toString();
    let month = (1 + date.getMonth()).toString();
    if (month.length < 2) month = "0" + month;
    let day = date.getDate().toString();
    if (day.length < 2) day = "0" + day;
    return year + "." + month + "." + day;
  }

  const rightNow = new Date();
  const today = new Date(
    rightNow.getFullYear(),
    rightNow.getMonth(),
    rightNow.getDate()
  );

  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let dateSelected;
  let dateFrom;
  let dateTo;
  const rangeMod = false;

  const title = datepicker.querySelector(".datepicker__title");
  const prevBtn = datepicker.querySelector(".datepicker__btn_prev");
  const nextBtn = datepicker.querySelector(".datepicker__btn_next");
  const gridRoot = datepicker.querySelector(".datepicker__grid");
  const clearBtn = datepicker.querySelector(".datepicker__clear");

  function setDate(date) {
    inputElement.value = dateFormat(date);
  }
  function clearDate() {
    inputElement.value = "";
  }

  function renderYearAndMonth(root, year, month) {
    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ];
    root.innerText = monthNames[month] + " " + year;
  }
  function renderCurrentMonthGrid(root, year, month) {
    let currentMonthFirstDay = getFirstDayOfMonth(year, month);
    let currentMonthLength = getLastDateOfMonth(year, month);
    function createCurrentMonthGrid() {
      let grid = [[], [], [], [], [], [], []];
      for (let i = 1; i <= grid.length; i++) {
        for (
          let j = i + 1 - currentMonthFirstDay - 7;
          j <= currentMonthLength + 7;
          j += 7
        ) {
          if (j - i >= -7 && j - i <= currentMonthLength - 1)
            grid[i - 1].push(new Date(year, month, j));
        }
      }
      return grid;
    }
    const grid = createCurrentMonthGrid();
    const dayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    const gridDom = grid.reduce((grid, column, i) => {
      const columnClass = "datepicker__column";
      const dayClass = "datepicker__day";
      const dateBaseClass = "datepicker__date";
      return (
        grid +
        `<div class=${columnClass}><div class=${dayClass}>${dayNames[i]}</div>` +
        column.reduce((column, date) => {
          function dateClassCombine() {
            let classList = dateBaseClass;
            if (+date === +today) {
              classList = `${classList} ${dateBaseClass}_today`;
            }
            if (+date === +dateSelected) {
              classList = `${classList} ${dateBaseClass}_selected`;
            }
            if (+date === +dateFrom) {
              classList = `${classList} ${dateBaseClass}_from`;
            }
            if (+date === +dateTo) {
              classList = `${classList} ${dateBaseClass}_to`;
            }
            if (+date > +dateFrom && +date < +dateTo) {
              classList = `${classList} ${dateBaseClass}_in-range`;
            }
            if (
              date.getFullYear() < year ||
              (date.getFullYear() === year && date.getMonth() - month < 0)
            ) {
              classList = `${classList} ${dateBaseClass}_prev-month`;
            }
            if (
              date.getFullYear() > year ||
              (date.getFullYear() === year && date.getMonth() - month > 0)
            ) {
              classList = `${classList} ${dateBaseClass}_next-month`;
            }
            return classList;
          }
          let dateClass = dateClassCombine();

          return column + `<div class="${dateClass}">${date.getDate()}</div>`;
        }, "") +
        `</div>`
      );
    }, "");
    root.innerHTML = gridDom;
  }

  renderYearAndMonth(title, currentYear, currentMonth);
  renderCurrentMonthGrid(gridRoot, currentYear, currentMonth);

  prevBtn.addEventListener("click", e => {
    e.preventDefault();
    if (currentMonth == 0) {
      currentMonth = 11;
      currentYear--;
    } else currentMonth--;
    renderCurrentMonthGrid(gridRoot, currentYear, currentMonth);
    renderYearAndMonth(title, currentYear, currentMonth);
  });
  nextBtn.addEventListener("click", e => {
    e.preventDefault();
    if (currentMonth == 11) {
      currentMonth = 0;
      currentYear++;
    } else currentMonth++;
    renderYearAndMonth(title, currentYear, currentMonth);
    renderCurrentMonthGrid(gridRoot, currentYear, currentMonth);
  });
  gridRoot.addEventListener("click", e => {
    if (e.target.classList.contains("datepicker__date")) {
      let realMonth = currentMonth;
      let realYear = currentYear;
      if (e.target.classList.contains("datepicker__date_prev-month")) {
        if (realMonth == 0) {
          realMonth = 11;
          realYear--;
        } else realMonth--;
      } else if (e.target.classList.contains("datepicker__date_next-month")) {
        if (realMonth == 11) {
          realMonth = 0;
          realYear++;
        } else realMonth++;
      }
      const targetDate = new Date(realYear, realMonth, e.target.innerText);
      gridRoot
        .querySelectorAll(".datepicker__date_selected")
        .forEach(element => {
          element.classList.remove("datepicker__date_selected");
        });
      e.target.classList.add("datepicker__date_selected");
      if (dateSelected && +targetDate === +dateSelected) {
        dateSelected = null;
      } else if (!dateSelected) {
        dateSelected = targetDate;
        if (dateFrom && dateTo) {
          dateFrom = null;
          dateTo = null;
          renderCurrentMonthGrid(gridRoot, currentYear, currentMonth);
        }
        setDate(dateSelected);
      } else if (!rangeMod) {
        dateSelected = targetDate;
        setDate(dateSelected);
      } else if (rangeMod) {
        if (+targetDate === +dateFrom) {
          dateFrom = null;
        } else if (+targetDate === +dateTo) {
          dateTo = null;
        } else if (+targetDate < +dateSelected) {
          dateFrom = targetDate;
          dateTo = dateSelected;
        } else if (+targetDate > +dateSelected) {
          dateFrom = dateSelected;
          dateTo = targetDate;
        }
        if (dateFrom && dateTo) {
          dateSelected = null;
          renderCurrentMonthGrid(gridRoot, currentYear, currentMonth);
        }
      }
    }
  });
  clearBtn.addEventListener("click", e => {
    e.preventDefault();
    clearDate();
  });

  addPluginCloserToBlock(
    document,
    datepicker,
    "datepicker_active",
    inputElement.parentElement
  );
}

initdatepicker(document.querySelector(".field_date .field__input"));
