// inital information and canvas initialisation
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var screenWidth = 600;
var screenHeight = 400;
var fields = [];
var number_of_blocks = 0;
var generating = false;

// coordinates initalisaton
var dimenzija_polja = 10;
var stevilo_polj_x = (screenWidth / dimenzija_polja);
var stevilo_polj_y = (screenHeight / dimenzija_polja);

// templates
var glider = [[20,20], [21,20], [22,20], [22,19], [21,18]];
var small_exploder = [[20,20], [21,21], [22,20], [20,19], [21,19], [22,19], [21,18]];
var exploder = [[20,16], [22,16], [24,16], [20,17], [24,17], [20,18], [24,18], [20,19], [24, 19], [20,20], [22,20], [24,20]];
var templates = [glider, small_exploder, exploder];

var init = [0,0];
canvas.addEventListener('mousedown', function(e) {
  getCursorPosition(canvas, e)
})



// draw the inital field 
drawField();


/**
 * function for drawing current field state 
 * no_x is number of blocks on the x axis
 * no_y is number of blocks on the y axis
 * init is an array of initial position for drawing 
 * dim  is one block dimensition 
 * fields is an array of all activated fields
 */
function drawField() {
  var no_x = stevilo_polj_x;
  var no_y = stevilo_polj_y;
  var dim = dimenzija_polja;

  // clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.moveTo(init[0], init[1]);
  ctx.lineWidth = 1;

  var curr = [init[0], init[1]];

  for (var i = 0; i < no_y; i++) {

    for (var j = 0; j < no_x; j++) {

      var filled = false;

      for (var t = 0; t < fields.length; t++) {
        if (fields[t].x == j && fields[t].y == i && fields[t].checked) {
          filled = true;
          break;
        }
      }

      if (filled) {
        ctx.beginPath();
        ctx.fillRect(curr[0], curr[1], dim, dim);
      } else {
        ctx.beginPath();
        ctx.strokeRect(curr[0], curr[1], dim, dim);
        // ctx.stroke();
      }

      curr[0] += dim;
    }

    curr[1] += dim;
    curr[0] = init[0];

  }

  reset_num_fields();
}

/**
 * function for handling click on the canvas
 */
function getCursorPosition(canvas, event) {

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  var vrstica = Math.floor(y / dimenzija_polja);
  var stolpec = Math.floor(x / dimenzija_polja);


  var polje = new Polje(stolpec, vrstica, true);
  var inArray = false;

  for (var i = 0; i < fields.length; i++) {
    if (objectCompare(polje, fields[i])) {

      var rem_x = polje.x;
      var rem_y = polje.y;

      // this field is turned on 
      // remove it from array 
      fields = fields.filter(el => el.x != rem_x || el.y != rem_y);
      inArray = true;

      recount_on_removed(x, y);
    }
  }

  // this field is not turned on 
  // we add it to the array 
  if (!inArray) {
    fields.push(polje);
    recunt(polje, true);
    polje.print();

    // reset status field
    reset_num_fields();
  }

  drawField();

  $("#generate-btn").prop('disabled', false);

}

/**
 * function for starting an evolution 
 */
async function generate(indicator) {

  console.log(fields); 
  generating = true;

  document.getElementById("generate-btn").disabled = true;
  document.getElementById("stop-btn").disabled = false;
  while (generating) {

    // case where we run out of the fields or there was blank input
    if (fields.length == 0) {
      stop();
      break;
    }

    var new_fields = [];
    var candidates = [];

    // creating new candidated from dead fields
    var n = fields.length;

    for (var i = 0; i < n; i++) {
      var foo = fields[i];

      if (!(existing_field(foo.x - 1, foo.y - 1))) {
        var polje = new Polje(foo.x - 1, foo.y - 1, false);
        recunt(polje, false);
        candidates.push(polje);
      }
      if (!(existing_field(foo.x, foo.y - 1))) {
        var polje = new Polje(foo.x, foo.y - 1, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x + 1, foo.y - 1))) {
        var polje = new Polje(foo.x + 1, foo.y - 1, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x - 1, foo.y))) {
        var polje = new Polje(foo.x - 1, foo.y, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x + 1, foo.y))) {
        var polje = new Polje(foo.x + 1, foo.y, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x - 1, foo.y + 1))) {
        var polje = new Polje(foo.x - 1, foo.y + 1, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x, foo.y + 1))) {
        var polje = new Polje(foo.x, foo.y + 1, false);
        recunt(polje, false);
        candidates.push(polje);

      }
      if (!(existing_field(foo.x + 1, foo.y + 1))) {
        var polje = new Polje(foo.x + 1, foo.y + 1, false);
        recunt(polje, false);
        candidates.push(polje);

      }

      for (var j = 0; j < candidates.length; j++) {
        fields.push(candidates[j]);
      }
      candidates = [];
    }
    
    // processing all fields 
    // killing underpopulated and overpopulated 
    // respawning dead fields with enogh neighbors
    for (var i = 0; i < fields.length; i++) {
      // if the field has 2 or 3 neighbors it survives
      if (fields[i].checked) {
        if (fields[i].neighbors == 2 || fields[i].neighbors == 3) {
          new_fields.push(fields[i]);
        }
      } else if (!fields[i].checked && fields[i].neighbors == 3) {
        new_fields.push(fields[i]);
      }
    }

    fields = new_fields;
    
    for (var i = 0; i < fields.length; i++) {
      fields[i].checked = true;
    }
    for (var i = 0; i < fields.length; i++) {
      recunt(fields[i], false);
    }
      

    drawField();

    console.log(fields);

    await new Promise(r => setTimeout(r, 100));

    if (indicator == 100) {
      break;
    }
  }
}

function stop() {
  console.log("Stoping");
  generating = false;

  $("#stop-btn").prop('disabled', true);
  $("#generate-btn").prop('disabled', false);
}

function clean_field() {

  console.log("Cleaning");
  stop();

  fields = [];
  drawField();


  console.log(fields);
}

/**
 * function for comparing two objects
 */
function objectCompare(obj1, obj2) {
  return (obj1.x == obj2.x && obj1.y == obj2.y);
}

/**
 * function for counting number of neighbors
 */
function recunt(polje, original) {

  polje.neighbors = 0;
  var buff = [];

  for (var i = 0 ; i < fields.length; i++) {
    if (!fields[i].checked) {
      continue;

    } else if (Math.abs(polje.x - fields[i].x) == 1 && polje.y == fields[i].y || Math.abs(polje.y - fields[i].y) == 1 && polje.x == fields[i].x) {
      polje.neighbors++;
      buff.push(fields[i]);
      if (original) {recunt(fields[i], false);}
      continue;

    } else if (Math.abs(polje.x - fields[i].x) == 1 && Math.abs(polje.y - fields[i].y) == 1) {
      polje.neighbors++;
      buff.push(fields[i]);
      if (original) {recunt(fields[i], false);}
      continue;
    }
  }

  if (polje.x == 2 && polje.y == 0) {
    console.log(buff);
  }
}

/**
 * function for recounting the number of neighbirs of all the fields who 
 * have lost their neighbor 
 */
function recount_on_removed(x, y) {

  for (var i = 0; i < fields.length; i++) {
    
    var curr = fields[i];

    if (Math.abs(x + y - curr.x - curr.y)) {

      recunt(fields[i], false);

    } else if (Math.abs(x - curr.x) == 0 && Math.abs(y - curr.y) == 0) {

      recunt(fields[i], false);

    }
  }

  reset_num_fields();
}

function existing_field(x, y) {

  for (var i = 0; i < fields.length; i++) {
    if (fields[i].x == x && fields[i].y == y) {
      return true;
    }
  }

  return false;
}

/**
 * function for adding fields from a saved template 
 */
function template(index) {

  console.log("template");

  for (var i = 0; i < templates[index].length; i++) {
    var polje = new Polje(templates[index][i][0], templates[index][i][1], true);
    console.log("New field added");

    fields.push(polje);

    recunt(polje, true);

  }

  $("#generate-btn").prop('disabled', false);
  console.log(fields);

  drawField();
}

function status() {
  console.log(fields);
}

/**
 * function for recounting new number of fields on the board
 */
function reset_num_fields() {
  $("#block-num-span").text(fields.length);
}


/**
 * constructor for creating selected fields
 */
 function Polje(x, y, checked) {
  this.x = x;
  this.y = y;
  this.checked = checked;
  this.neighbors = 0;

  this.print = function() {
    console.log("Polje( x:" + this.x + " y:" + this.y + " )");
  }
}