let headRows = document.getElementById("head-rows");

let bold = document.getElementById("bold");
let italics = document.getElementById("italics");
let underlined = document.getElementById("underlined");

let fontSizeOption = document.getElementById("font-size");
let fontStyleOption = document.getElementById("font-family");

let cutButton = document.getElementById("cut");
let copyButton = document.getElementById("copy");
let pasteButton = document.getElementById("paste");

let bgColor = document.getElementById("bg-color");
let textColor = document.getElementById("text-color");

let leftAlign = document.getElementById("left");
let rightAlign = document.getElementById("right");
let centerAlign = document.getElementById("center");

let addSheet = document.getElementById('Add-button');

let updateJsonFile = document.getElementById('json-file');

let columns = 26;
let rows = 100;
let currentCell = "";
let cutCell = {};
let numSheets = 1;

for (let cols = 0; cols < columns; cols++) {
  let headCols = document.createElement("th");
  headCols.innerText = String.fromCharCode(cols + 65);
  headRows.append(headCols);
}

let tBody = document.getElementById("table-body");
for (let row = 1; row <= rows; row++) {
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  th.innerText = row;
  tr.append(th);

  for (let col = 0; col < columns; col++) {
    let td = document.createElement("td");
    td.setAttribute("contenteditable", "true");
    // setting id atrribute to the selected cell
    td.setAttribute("id", `${String.fromCharCode(col + 65)}${row}`);
    td.addEventListener("focus", (event) => focusFunc(event));
    td.addEventListener('input', (event) => onInputFn(event));
    tr.append(td);
  }
  tBody.append(tr);
}

function onInputFn(event){
  console.log(event.target);
}

function focusFunc(event) {
  // we set the id dynamically
  currentCell = event.target;
  document.getElementById("current-cell").innerText = currentCell.id;
}


bold.addEventListener("click", () => {
  if (currentCell.style.fontWeight == "bold") {
    currentCell.style.fontWeight = "normal";
  } else currentCell.style.fontWeight = "bold";
  updateMatrix();
});

italics.addEventListener("click", () => {
  if (currentCell.style.fontStyle === "italic") {
    currentCell.style.fontStyle = "normal";
  } else currentCell.style.fontStyle = "italic";
  updateMatrix();
});
underlined.addEventListener("click", () => {
  if (currentCell.style.textDecoration == "underline") {
    currentCell.style.textDecoration = "normal";
  }
  currentCell.style.textDecoration = "underline";
  updateMatrix();
});

fontSizeOption.addEventListener("change", () => {
  currentCell.style.fontSize = fontSizeOption.value;
  updateMatrix();
});
fontStyleOption.addEventListener("change", () => {
  currentCell.style.fontFamily = fontStyleOption.value;
  updateMatrix();
});

cutButton.addEventListener("click", () => {
  cutCell = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
  };
  currentCell.innerText = "";
  currentCell.style = null;
});
copyButton.addEventListener("click", () => {
  cutCell = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
  };
});
pasteButton.addEventListener("click", () => {
  if (cutCell.text) {
    currentCell.innerText = cutCell.text;
    currentCell.style = cutCell.style;
  }
});

bgColor.addEventListener("input", () => {
  currentCell.style.backgroundColor = bgColor.value;
  updateMatrix();
});
textColor.addEventListener("input", () => {
  currentCell.style.color = textColor.value;
  updateMatrix();
});

leftAlign.addEventListener('click', () => {
  currentCell.style.textAlign = 'left' ;
  updateMatrix();
})

rightAlign.addEventListener('click', () => {
  currentCell.style.textAlign = 'right' ;
  updateMatrix();
})

centerAlign.addEventListener('click', () => {
  currentCell.style.textAlign = 'center' ;
  updateMatrix();
})
// creating a 2d array by taking instance of constructor class
let matrix = new Array(rows);
for (let row = 0; row <= rows; row++) {
  //  each row should have a new array
  matrix[row] = new Array(columns);
  for (let col = 0; col <= columns; col++) {
    // each index have an object
    matrix[row][col] = {};
  }
}

// updating every cell to matrix
function updateMatrix(currentCell){
  let obj = {
    style: currentCell.style.cssText,
    text: currentCell.innerText,
    id: currentCell.id,
  }
  let id = currentCell.id.split('');
  // id = A1 --> ['A' 1]
  let i = id[1]-1; // 'A' --> 0th index
  let j = id[1].charCodeAt(0)-65;
  matrix[i][j] = obj ;
}

function  downloadjson() {
  const jsonString = JSON.stringify(matrix);
  // we can also take xml here for that change "accept" -> "xml" in html file
  const blob = new blob([jsonString], {type: 'application/json'});

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "table.json" ;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

updateJsonFile.addEventListener("change" , readJsonFile);

function readJsonFile(event) {
  const file = event.target.files[0];
  if(file){
    // fileReader is an inbuild class
    const reader = new FileReader();
    reader.onload =  function(e){
      const fileContent = e.target.result;

      try{
        const jsonData = JSON.parse(fileContent);
        console.log('matrix2' , jsonData);
        matrix = jsonData;
        jsonData.forEach((row) => {
          row.forEach((cell) => {
            if(cell.id){
              var myCell = document.getElementById(cell.id);
              myCell.innerText = cell.text;
              myCell.style.cssText = cell.style;
            }
          });
        });

      } catch(error) {
        console.log('error parsing json file', error)
      }  
    };
    reader.readAsText(file);

  }
}

addSheet.addEventListener('click', () => {
let button = document.createElement('button');
button.className = 'new-sheet';
// addNewSheet.innerText =`Sheet:${sheetNum++}`;

  if(numSheets == 1) {
  var myArr = [matrix];
  localStorage.setItem("arrMatrix", JSON.stringify(myArr));
  }else{
    var localStorageArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    var myArr = [...localStorageArr, matrix];
    localStorage.setItem('ArrMatrix', JSON.stringify(myArr));
  }
numSheets++;
let currSheetNum = numSheets;

// empting the matrix
for(i=0; i<rows; i++) {
  matrix[i] = new Array(columns);
  for(j=0; j<columns; j++){
    matrix[i][j] = {};
  }
}

tBody.innerHtml = "";

for(let row=0; row<rows; row++){
  let tr = document.createElement('tr');
  let th = document.createElement('th');
  th.innerText = row+1
  tr.append(th);
  for(let cols=0; cols<columns; cols++){
     let td = document.createElement('td');
     td.setAttribute('contenteditable', "true");
     td.setAttribute("id", `${String.fromCharCode(65 + cols)}${row+1}`);
     td.setAttribute('spellcheck', "false");
     td.addEventListener('focus', (event) => focusFunc(event));
     td.addEventListener('input', (event) => onInputFn(event));
     tr.appendChild(td);
  } 
  tBody.appendChild(tr);
}
button.innerText = 'sheet' + currSheetNum;
document.getElementById('add-sheet').appendChild(button);



document.getElementById(`sheet${currSheetNum}`).addEventListener('click', () => {
var myArr = JSON.parse(localStorage.getItem('ArrMatrix'));
let tableData = myArr[0];
matrix = tableData;
tableData.forEach((row) => {
row.forEach((cell) => {
  if(cell.id){
    var myCell = document.getElementById(cell.id);
    myCell.innerText = cell.text;
    myCell.style.cssTest = cell.style;
  }
});
}) ;
});
});