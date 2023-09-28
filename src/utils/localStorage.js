// 存储数据到本地存储中
export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // 从本地存储中获取数据
  export function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  }
  