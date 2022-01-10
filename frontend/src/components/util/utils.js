//유효값 검사(undefined, null, 공백값 체크)
export const isValid = value =>
  typeof value !== 'undefined' && value !== null && value !== '';

/**
 * 페이징, 정렬, 필터링 처리를 위한 params for axios
 * @param {*} react-table onFetchData호출 시 전달받는 state
 * @param {*} externalParams 추가적으로 요청할 데이터
 */
export const getPagingParams = (
  { page, pageSize, sorted, filtered },
  externalParams,
) => {
  const params = {
    page,
    size: pageSize,
    ...externalParams,
  };

  //sorting parameter
  let sorts = [];
  for (let i = 0, length = sorted.length; i < length; i++) {
    const sort = sorted[i];
    sorts.push(`${sort.id},${sort.desc ? 'desc' : 'asc'}`);
  }
  params['sort'] = sorts;

  //filtering parameter
  for (let i = 0, length = filtered.length; i < length; i++) {
    const filter = filtered[i];
    params[filter.id] = filter.value;
  }

  return params;
};

/** IP유효성 검사 */
export const isIp = ip =>
  /^(?=.*[^.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/.test(ip);
/** Port유효성 검사 */
export const isPort = port => {
  if (isNaN(port)) {
    return false;
  }
  const toInt = Number.parseInt(port, 10);
  if (0 <= toInt && toInt <= 65535) {
    return true;
  } else {
    return false;
  }
};
/** 리눅스경로유효성 검사 */
export const isLinuxPath = path => /^(\/[^\\/:*?"<>| ]*)+\/?$/.test(path);

export const objectDeepCopy = (obj) => {
  let clone = Object.entries(obj).reduce((acc, [key, val]) => {
    if(typeof(val) === "object" && val !== null) {
      acc[key] = objectDeepCopy(val);
    }
    else {
      acc[key] = val;
    }
    return acc;
  }, {});
  return clone;
}

/**
 * @param {Date} date ex: new Date()
 */
export const makeDateString = (date) => {
  const d = new Date(date);
  const dateArr = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(n => {
    return ("" + n).length === 1? "0" + n : n;
  });
  return dateArr.join("-");
}

/**
 * @param {Date} date ex: new Date()
 */
export const makeDateTimeString = (date) => {
  const d = new Date(date);
  const dateArr = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(n => {
    return ("" + n).length === 1? "0" + n : n;
  });
  const timeArr = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => {
    return ("" + n).length === 1? "0" + n : n;
  });
  return `${dateArr.join("-")} ${timeArr.join(":")}`;
}

export const convertHex2Str = hex => {
  try {
    if(hex.length % 4 !== 0) return "Error";
    return hex.split(/(.{4})/g)
              .filter(_=>_)
              .map(str => String.fromCharCode(parseInt(str)))
              .join("");
  }
  catch {
    return "Error";
  }
}
