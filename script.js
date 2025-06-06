const upload = document.getElementById("upload");
const difficultyInput = document.getElementById("difficulty");
const startBtn = document.getElementById("start-btn");
gridSize = parseInt(difficultyInput.value);
let imageURL = null;
// 上傳圖片
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  imageURL = URL.createObjectURL(file);
  const preview = document.getElementById("preview");
  preview.src = imageURL;
});

startBtn.addEventListener("click", () => {
  const inputVal = parseInt(difficultyInput.value);
  if (inputVal < 2 || inputVal > 10 || isNaN(inputVal)) {
    alert("請輸入 2~10 的難度");
    return;
  }
  if (!imageURL) {
    alert("請先上傳圖片！");
    return;
  }
  gridSize = inputVal;
  setPuzzleBackground(imageURL);
});
function setPuzzleBackground(imageURL) {
  const puzzleBoard = document.querySelector("#puzzle-board");
  puzzleBoard.innerHTML = "";
  const tiles = [];
  const tileSize = 900 / gridSize;
  const totalTiles = gridSize * gridSize;
  puzzleBoard.style.width = "900px";
  puzzleBoard.style.height = "900px";
  puzzleBoard.style.display = "grid";
  puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.correct = i;

    tile.style.width = `${tileSize}px`;
    tile.style.height = `${tileSize}px`;
    tile.style.backgroundImage = `url(${imageURL})`;
    tile.style.backgroundSize = `900px 900px`;

    const x = -(i % gridSize) * tileSize;
    const y = -Math.floor(i / gridSize) * tileSize;
    tile.style.backgroundPosition = `${x}px ${y}px`;

    tile.draggable = true;
    tiles.push(tile);
  }
  const shuffled = tiles.sort(() => Math.random() - 0.5);

  //  加入到 DOM（順序錯，但每塊圖位置對）
  shuffled.forEach((tile, index) => {
    tile.dataset.index = index; // 加入目前的位置編號（用來拖曳交換時比對）
    enableDrag(tile);
    puzzleBoard.appendChild(tile);
  });
}

function enableDrag(tile) {
  tile.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", tile.dataset.index);
  });

  tile.addEventListener("dragover", (e) => {
    e.preventDefault(); // 必須加這行，否則 drop 不會觸發
  });

  tile.addEventListener("drop", (e) => {
    e.preventDefault();
    const fromIndex = e.dataTransfer.getData("text/plain");
    const toIndex = tile.dataset.index;

    const fromTile = document.querySelector(`.tile[data-index='${fromIndex}']`);
    const toTile = document.querySelector(`.tile[data-index='${toIndex}']`);

    // 交換兩塊 tile 的 DOM 位置
    if (fromTile && toTile && fromTile !== toTile) {
      const fromClone = fromTile.cloneNode(true);
      const toClone = toTile.cloneNode(true);

      enableDrag(fromClone);
      enableDrag(toClone);

      const puzzleBoard = document.getElementById("puzzle-board");
      puzzleBoard.replaceChild(fromClone, toTile);
      puzzleBoard.replaceChild(toClone, fromTile);

      checkWin();
    }
  });
}

function checkWin() {
  const tiles = document.querySelectorAll(".tile");
  let isCorrect = true;
  tiles.forEach((tile, i) => {
    if (parseInt(tile.dataset.correct) !== i) {
      isCorrect = false;
    }
  });
  if (isCorrect) {
    setTimeout(() => {
      alert("🎉 拼圖完成！");
    }, 100);
  }
}
