export function delFeature({ fids, service, docLayer }) {
  var deleteService = new Zondy.Service.EditDocFeature(
    service.name,
    service.layerId,
    {}
  );
  deleteService.deletes(fids, onPloySuccess(docLayer));
}
function onPloySuccess(docLayer) {
  return function (data) {
    if (data.succeed) {
      alert("添加要素成功！");
      docLayer.refresh();
    } else {
      alert("添加要素失败！");
    }
  };
}
