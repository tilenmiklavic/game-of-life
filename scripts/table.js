MIN_SQUARE_DIMENSION = 30;

class Table {
  constructor(element) {
    this.htmlElement = element;
    const height = document.getElementById("grid").offsetHeight;
    const width = document.getElementById("grid").offsetWidth;
    this.slider = document.getElementById("speedRange");
    this.sliderValue = document.getElementById("sliderValue");
    this.sliderValue.innerHTML = this.slider.value;

    this.rows = parseInt(height / MIN_SQUARE_DIMENSION);
    this.cols = parseInt(width / MIN_SQUARE_DIMENSION);
    this.cells = [];

    this.updateGridCss();
    this.insertCells();

    document.getElementById("start").addEventListener("click", () => {
      this.ticker = new Ticker(this);
      this.ticker.startTicker(this.slider.value);
    });

    this.slider.oninput = () => {
      this.ticker.stopTicker();
      this.ticker.startTicker(this.slider.value);
      this.sliderValue.innerHTML = this.slider.value;
    };
  }

  updateGridCss() {
    const oldWidth = document.getElementById("grid").offsetWidth;
    const newWidth = this.cols * MIN_SQUARE_DIMENSION;

    this.htmlElement.style.marginLeft = `${(oldWidth - newWidth) / 2}px`;
    this.htmlElement.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
    this.htmlElement.style.maxWidth = `${newWidth}px`;
    this.htmlElement.style.maxHeight = `${this.rows * MIN_SQUARE_DIMENSION}px`;
  }

  insertCells() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = new Cell(this, i, j, false);
        this.cells.push(cell);
        this.htmlElement.appendChild(cell.htmlElement);
      }
    }
  }

  getNeighbors(col, row) {
    return this.cells.filter(
      (cell) =>
        Math.abs(cell.col - col) <= 1 &&
        Math.abs(cell.row - row) <= 1 &&
        (cell.row != row || cell.col != col)
    );
  }
}
