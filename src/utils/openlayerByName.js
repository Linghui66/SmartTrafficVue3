export function getLayerByName(map, name) {
  /* 1、获取所有图层 */
  var layers = map.getLayers().array_;
  /* 2、获对应name  image值的图层  find */
  let obj = layers.find((item) => {
    return item.get("name") == name;
  });
  return obj;
}
