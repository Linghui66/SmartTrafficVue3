import { Http } from "./MockHttp";
const getMockHttp = () => {
  return Http({
    url: "http://127.0.0.1:8000/notice",
    method: "get",
  });
};
const postMockHttp = (data) => {
  return Http({
    url: "http://127.0.0.1:8000/notice",
    method: "post",
    data,
  });
};
const deleteMockHttp = (id) => {
  return Http({
    url: `http://127.0.0.1:8000/notice/${id}`,
    method: "delete",
  });
};
const patchMockHttp = ([id, data]) => {
  return Http({
    url: `http://127.0.0.1:8000/notice/${id}`,
    method: "patch",
    data,
  });
};
export { getMockHttp, postMockHttp, deleteMockHttp, patchMockHttp };
