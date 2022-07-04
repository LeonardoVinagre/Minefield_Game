function validateData() {
  var mrow = Math.round(document.getElementById("rows").value);
  var mcol = Math.round(document.getElementById("cols").value);
  var quant_mines = Math.round(document.getElementById("mines").value);


  if (mrow >= 1 && mcol >= 1  && quant_mines <= mrow * mcol) {
    console.log('dados validos');
    generateField(mrow,mcol,quant_mines);
  } 
  else{
      console.log('dados invalidos');
      return 0;
  }
}

function generateField(mrow, mcol, quant_mines) {
  var minedField = document.getElementById("minedField");
  var field = [];
  var aux;

  while (minedField.firstChild) {
    minedField.removeChild(minedField.firstChild);
  }

  genCamps(mrow, mcol, quant_mines, aux, field);
}

const genCamps = (mrow, mcol, quant_mines, aux, field) => {
  if (mrow > mcol) {
    aux = mrow;
  } else {
    aux = mcol;
  }
  for (i = 0; i < mrow; i++) {
    field[i] = [];
    for (j = 0; j < mcol; j++) {
      field[i][j] = Math.floor(Math.random() * aux);
    }
  }

  setMines(mrow, mcol, quant_mines, aux, field);
};

const setMines = (mrow, mcol, quant_mines, aux, field) => {
  do {
    aux--;
    for (i = 0; i < mrow; i++) {
      for (j = 0; j < mcol; j++) {
        if (field[i][j] == aux && quant_mines > 0) {
          field[i][j] = "*";
          quant_mines--;
        }
      }
    }
  } while (quant_mines != 0);

  //reset zero to other positions
  for (i = 0; i < mrow; i++) {
    for (j = 0; j < mcol; j++) {
      if (field[i][j] != "*") {
        field[i][j] = 0;
      }
    }
  }

  setRemaining(mrow, mcol, field);
};

const setRemaining = (mrow, mcol, field) => {
  for (var i = 0; i < mrow; i++) {
    for (var j = 0; j < mcol; j++) {
      if (field[i][j] != "*") {
        if (i > 0 && field[i - 1][j - 1] === "*") field[i][j]++;
        if (i > 0 && field[i - 1][j] === "*") field[i][j]++;
        if (i > 0 && field[i - 1][j + 1] === "*") field[i][j]++;
        if (i < mrow - 1 && field[i + 1][j - 1] === "*") field[i][j]++;
        if (i < mrow - 1 && field[i + 1][j] === "*") field[i][j]++;
        if (i < mrow - 1 && field[i + 1][j + 1] === "*") field[i][j]++;
        if (field[i][j - 1] === "*") field[i][j]++;
        if (field[i][j + 1] === "*") field[i][j]++;
      }
    }
  }
  loadField(field,mrow,mcol);
};

//insert the field in the html
const loadField = (field,mrow,mcol) => {
  for (var i = 0 ; i < mrow ; i++) {
    var tr = document.createElement("tr");
    for (var j = 0 ; j < mcol ; j++) {
        var td = document.createElement("td");
        var span = document.createElement("span");
        span.textContent = field[i][j];
        span.classList.add('hidden');
        td.appendChild(span);
        var index = (i+'-'+j);
        td.setAttribute('index',index);
        td.addEventListener('click', function(){reveal(this.attributes.index.value,mrow,mcol)});///
        tr.appendChild(td);
     }
    
    document.getElementById("minedField").appendChild(tr);
  }
  
};


const reveal = async (index,mrow,mcol) => {

  var td = document.querySelector('[index="'+index+'"]');
  let Flag = document.getElementById('setFlag');
  if(Flag.checked){
    td.children.item(0).textContent = 'flag';//////////////////////////////
    return 0; 
  }
  else if(td.textContent == '*'){
    console.log('Perdeu!');
    td.children.item(0).classList.remove('hidden');
  }
  else if(td.textContent != 0 && td.textContent != '*'){
    console.log('numero');
    td.children.item(0).classList.remove('hidden');

  }
  else if(td.textContent == 0 && td.textContent != '*' && td.classList.contains('visible') == false ){
    var ij = index.split('-');
    checkArea(ij,mrow,mcol);
  }
}

function checkArea(ij,mrow,mcol){
  
  var i = parseInt(ij[0], 10);
  var j = parseInt(ij[1], 10);
  
  var aux = document.querySelector('[index="'+i+'-'+j+'"]');
  aux.classList.add("visible");
  aux.children.item(0).classList.remove('hidden');

  
  
  var right = (i +'-'+(j+1));
  if(i > 0){
    var up = ((i-1) +'-'+j);
    reveal(up,mrow,mcol);
  }
  if(i < mrow){
    var down = ((i+1) +'-'+j);
    reveal(down,mrow,mcol);
  }
  if(j > 0){
    var left = (i +'-'+(j-1));
    reveal(left,mrow,mcol);
  }
  if(j < mcol){
    var right = (i +'-'+(j+1));
    reveal(right,mrow,mcol);
  }

  
}

