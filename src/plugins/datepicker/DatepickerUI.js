const Month = require("./Month");
module.exports = class DatepickerUI {
  constructor(datepicker) {
    this.datepicker = datepicker;
    this.baseClass = "datepicker";
    this.today = this.getToday();
    this.init();
  }
  getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  init() {
    this.instance = document.createElement("div");
    this.instance.classList.add(`${this.baseClass}`);
    this.instance.innerHTML = `
      <div class="${this.baseClass}__header">
        <div class="${this.baseClass}__btn ${this.baseClass}__btn_prev"></div>
        <div class="${this.baseClass}__title"></div>
        <div class="${this.baseClass}__btn ${this.baseClass}__btn_next"></div>
      </div>
      <div class="${this.baseClass}__grid"></div>
      <div class="${this.baseClass}__footer">
        <div class="${this.baseClass}__clear">Очистить</div>
        <div class="${this.baseClass}__accept">Применить</div>
      </div>
    `;
    document.body.appendChild(this.instance);
    this.pickMonth();
    this.initBtnPrev();
    this.initBtnNext();
    this.initGridListener();
  }
  refreshTitle() {
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
    const title = this.instance.querySelector(`.${this.baseClass}__title`);
    title.innerText = `${monthNames[this.month]} ${this.year}`;
  }
  pickMonth(year, month) {
    let date;
    if (year !== undefined && month !== undefined) {
      date = new Date(year, month);
    } else {
      date = new Date();
    }
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.refreshTitle();
    this.renderGrid(Month.createGrid(this.year, this.month));
  }
  prevMonth() {
    this.pickMonth(this.year, this.month - 1);
  }
  nextMonth() {
    this.pickMonth(this.year, this.month + 1);
  }
  initBtnPrev() {
    const btn = this.instance.querySelector(`.${this.baseClass}__btn_prev`);
    btn.addEventListener("click", e => {
      e.preventDefault();
      this.prevMonth();
    });
  }
  initBtnNext() {
    const btn = this.instance.querySelector(`.${this.baseClass}__btn_next`);
    btn.addEventListener("click", e => {
      e.preventDefault();
      this.nextMonth();
    });
  }
  renderGrid(grid) {
    const dayNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    const gridDom = dayNames.map((dayName, i) => {
      return this.renderDayColumn(dayName, this.renderDate(grid[i]));
    });
    this.instance.querySelector(
      `.${this.baseClass}__grid`
    ).innerHTML = gridDom.join("");
  }
  renderDayColumn(dayName, dateElements) {
    return (
      `<div class=${this.baseClass}__column}><div class=${this.baseClass}__day>${dayName}</div>` +
      dateElements.join("") +
      `</div>`
    );
  }
  renderDate(dates) {
    const createClassList = date => {
      let classList = `${this.baseClass}__date`;
      // Find Today
      if (+date == +this.today) {
        classList += ` ${this.baseClass}__date_today`;
      }
      // Find out of range
      if (date.getMonth() !== this.month) {
        if (date.getFullYear() < this.year) {
          classList += ` ${this.baseClass}__date_prev-month`;
        }
        if (date.getFullYear() > this.year) {
          classList += ` ${this.baseClass}__date_next-month`;
        }
        if (date.getFullYear() === this.year) {
          if (date.getMonth() < this.month) {
            classList += ` ${this.baseClass}__date_prev-month`;
          }
          if (date.getMonth() > this.month) {
            classList += ` ${this.baseClass}__date_next-month`;
          }
        }
      }
      // Find Selected
      if (+date == +this.datepicker.selected) {
        classList += ` ${this.baseClass}__date_selected`;
      }
      return `"${classList}"`;
    };
    return dates.map(date => {
      const classList = createClassList(date);
      return `<div class=${classList}>${date.getDate()}</div>`;
    });
  }
  initGridListener() {
    const grid = this.instance.querySelector(`.${this.baseClass}__grid`);
    grid.addEventListener("click", e => {
      if (e.target.classList.contains(`${this.baseClass}__date`)) {
        if (e.target.classList.contains(`${this.baseClass}__date_prev-month`)) {
          this.datepicker.selectDate(
            new Date(this.year, this.month - 1, parseInt(e.target.innerText))
          );
        } else if (
          e.target.classList.contains(`${this.baseClass}__date_next-month`)
        ) {
          this.datepicker.selectDate(
            new Date(this.year, this.month + 1, parseInt(e.target.innerText))
          );
        } else {
          this.datepicker.selectDate(
            new Date(this.year, this.month, parseInt(e.target.innerText))
          );
        }
        grid.querySelectorAll(".datepicker__date_selected").forEach(element => {
          element.classList.remove("datepicker__date_selected");
        });
        e.target.classList.add("datepicker__date_selected");
      }
    });
  }
};
