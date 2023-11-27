const getTableManageList = document.querySelectorAll(".manage-list");

if(getTableManageList[0].children[0].children[1].className === "day-details") {
  false;
} else {

const getTableHeader = Array.from(getTableManageList[0].querySelectorAll("tr")).slice(0, 2); // 対象テーブルのヘッダー
const getTableData = getTableManageList[getTableManageList.length - 1].querySelectorAll("td"); // 対象テーブルのデータ

// Get highLight data function ==================================================
const handleMouseEvent = (event) => {
  const row = event.target.closest("tr");
  const rowTds = row.querySelectorAll("td");
  
  changeRowColor(row, rowTds, event);
  changeColumnColor(row, rowTds, event);
};

// row function ==================================================
const changeRowColor = (row, rowTds, event) => {
  rowTds.forEach((rowTd) => {
    if (event.target === rowTd) {
      // 選択セルのハイライト追加処理
      event.type === "mouseover"
      ? rowTd.classList.add("addTargetCellHighLight")
      : rowTd.classList.remove("addTargetCellHighLight");
    } else {
      // 選択セル以外の行のハイライト処理
      event.type === "mouseover"
      ? rowTd.classList.add("addHighLight")
      : rowTd.classList.remove("addHighLight");
    }
  });
  // 選択行が実績列の時に 左の４項目にハイライト処理
  if (row.className === "color-actual row-actual") {
    // 選択行の１つ前の要素（左の４項目を排除し、配列にして格納）
    const rowPrevious = Array.from(row.previousElementSibling.children).slice(0,4);
    rowPrevious.forEach((rowPreviousTd) => {
      event.type === "mouseover"
        ? rowPreviousTd.classList.add("addHighLight")
        : rowPreviousTd.classList.remove("addHighLight");
    });
  }
};

// column data function ==================================================
const changeColumnColor = (row, rowTds, event) => {
  let actualIndex = "";
  let planIndex = "";
  const columnsArray = Array.from(rowTds);
  const selectIndex = columnsArray.indexOf(event.target);
  const isLastColum = selectIndex !== columnsArray.length - 1;

  // 左の４項目を選択時に処理を行わないように終了
  if (selectIndex === -1) {
    return;
  } else if (row.className === "row-plan" && selectIndex <= 4) {
    return;
  } else if (row.className === "color-actual row-actual" && selectIndex <= 0) {
    return;
  }

  if (row.className === "color-actual row-actual") {
    actualIndex = selectIndex;
    planIndex = selectIndex + 4;
  } else {
    actualIndex = selectIndex - 4;
    planIndex = selectIndex;
  }

  const rows = event.target.closest("table").querySelectorAll("tr");
  const rowsArray = Array.from(rows);

  // データ部分のハイライト
  rowsArray.forEach((row) => {
    if (row.className === "color-actual row-actual") {
      event.type === "mouseover"
        ? row.children[actualIndex].classList.add("addHighLight")
        : row.children[actualIndex].classList.remove("addHighLight");
    } else if (row.className === "row-plan") {
      event.type === "mouseover"
        ? row.children[planIndex].classList.add("addHighLight")
        : row.children[planIndex].classList.remove("addHighLight");
    }
  });

  changeHeaderColor(event, planIndex, isLastColum); // ヘッダーのハイライト処理

};

// column header function ==================================================
let dayView = "";
let weekView = "";
const changeHeaderColor = (event, planIndex, isLastColum) => {
  dayView = "";
  weekView = "";
  getTableHeader.forEach((row, index) => {
    if (index === 0) {
      event.type === "mouseover"
        ? row.children[planIndex].classList.add("addHighLight")
        : row.children[planIndex].classList.remove("addHighLight");
        dayView = `${row.children[planIndex].innerText}日`; // 日にち表示
    } else if (index === 1 && isLastColum) {
      event.type === "mouseover"
        ? row.children[planIndex - 5].classList.add("addHighLight")
        : row.children[planIndex - 5].classList.remove("addHighLight");
        weekView = `（${row.children[planIndex - 5].innerText}）`; // 曜日表示
    }
  });
};

// event ==================================================
getTableData.forEach((td) => {
  td.addEventListener("mouseover", handleMouseEvent);
  td.addEventListener("mouseout", handleMouseEvent);
});


// information view =======================================
// div要素を差し込み
const wrapper = document.getElementById("wrapper");
const content = 
  '<div id="infoWindow" style="border: 1px solid black; position: absolute; background-color: white; padding: 0 5px; font-size: 12px; font-weight: bold;  z-index: 100;">ここに情報を表示</div>'
wrapper.insertAdjacentHTML("afterbegin", content)
const infoWindow = document.getElementById('infoWindow');

// イベント発生範囲をデータを入力範囲のみに狭くする
const getTdActual = document.querySelectorAll('[id^="td_actual_"]'); // id=td_actual_ のみ
const getTdPlan = document.querySelectorAll('[id^="td_plan_"]'); // id=td_plan_ のみ
const combinedTdActualAndPlan =[...getTdActual,...getTdPlan]; // 結合

// マウスオーバーイベントのリスナーを追加
combinedTdActualAndPlan.forEach((td) => {
  td.addEventListener("mouseover", function(event) {
    // ウィンドウの位置をマウスの位置に設定（例：右上に表示）
    infoWindow.style.left = (event.pageX + 20) + 'px'; // カーソルの右側に少し余裕を持たせる
    infoWindow.style.top = (event.pageY - 40) + 'px'; // カーソルの上側に表示
    infoWindow.innerText = `${dayView}${weekView}`;
    // 曜日によって、色を変更
    if (weekView.includes("土")){
      infoWindow.style.backgroundColor = "#D7E6FF"; // 土曜日のカラー
    } else if (weekView.includes("日")){
      infoWindow.style.backgroundColor = "#fdd7e4"; // 日曜日のカラー
    } else {
      infoWindow.style.backgroundColor = "#ffffff"; // 平日のカラー
    }
    // ウィンドウを表示
    infoWindow.style.display = 'block';
  });
});

// マウスアウトイベントでウィンドウを非表示にする
combinedTdActualAndPlan.forEach((td) => {
  td.addEventListener('mouseout', function() {
    infoWindow.style.display = 'none';
  });
});

}
