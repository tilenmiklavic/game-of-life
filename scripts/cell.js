class Cell {
  constructor(table, col, row, alive = false) {
    this.alive = alive;
    this.table = table;
    this.col = col;
    this.row = row;
    this.generateHtmlElement();
    this.changeState(alive);
  }

  changeState(alive) {
    this.alive = alive;
    this.htmlElement.style.backgroundColor = `${
      this.alive ? "black" : "white"
    }`;
  }

  prepareNextState() {
    this.nextState = this.checkRules(
      this.table.getNeighbors(this.col, this.row)
    );
  }

  applyNextState() {
    this.changeState(this.nextState);
  }

  checkRules(neighbors) {
    const aliveNeighbors = neighbors.filter(
      (element) => element.alive === true
    ).length;

    if (!this.alive) return aliveNeighbors === 3;
    if (aliveNeighbors < 2 || aliveNeighbors > 3) return false;

    return true;
  }

  generateHtmlElement() {
    let cell = document.createElement("div");
    cell.classList.add("square");
    cell.onclick = () => {
      this.changeState(!this.alive);
    };
    this.htmlElement = cell;
    return cell;
  }
}
