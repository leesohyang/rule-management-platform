import HighlightCell from "./HighlightCell";

function containsInsensitive(filter, row) {
  return (
    row[filter.id] == null ||
    String(row[filter.id])
      .toLowerCase()
      .includes(filter.value.toLowerCase())
  );
}

function getFiltered(gridState) {
  return { filtered: gridState.filtered };
}

export default {
  Cell: HighlightCell,
  filterable: true,
  filterMethod: containsInsensitive,
  getProps: getFiltered
};
//얘는 뭐지? 그냥 props value들 함수로 export 한거구나. 일단 grid table에 cell 인자로 주는게 뭔지 봐야겠다
