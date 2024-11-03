class Ticker {
  constructor(table) {
    this.table = table;
  }

  startTicker(interval = 1000) {
    console.log("start ticking");
    this.interval = setInterval(() => this.tick(), interval);
  }

  tick() {
    this.table.cells.forEach((cell) => {
      cell.prepareNextState();
    });

    this.table.cells.forEach((cell) => {
      cell.applyNextState();
    });
  }

  stopTicker() {
    clearInterval(this.interval);
  }
}
