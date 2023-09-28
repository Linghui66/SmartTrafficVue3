// 封装获取mapgisLayer图层数据并造GeoJSON数据的方法 （传入地图  目标图层 源图层的名字）
export const getMapgisLayer = ($map,layerName,souraceDataName) => {
  // 定义GeoJson数据
  souraceDataName = {
    type: "FeatureCollection",
    features: [],
  };

  var features = $map.queryRenderedFeatures({ layers: [layerName] });
  features.forEach((item) => {
    souraceDataName.features.push({
      type: item.type,
      geometry: item.geometry,
      properties: JSON.parse(item.properties.values_),
    });
  });
  return souraceDataName
};