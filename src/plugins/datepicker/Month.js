module.exports = class Month {
  constructor(year, month) {
    this.attachMediator(mediator);
    this.pick(year, month);
  }
  static getLength(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  static getFirstDay(year, month) {
    return new Date(year, month, 1).getDay();
  }
  static createGrid(year, month) {
    const length = this.getLength(year, month);
    const firstDay = this.getFirstDay(year, month);
    let grid = [[], [], [], [], [], [], []];
    for (let i = 1; i <= grid.length; i++) {
      for (let j = i + 1 - firstDay - 7; j <= length + 7; j += 7) {
        if (j - i >= -7 && j - i <= length - 1)
          grid[i - 1].push(new Date(year, month, j));
      }
    }
    return grid;
  }
};
