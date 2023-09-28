// 封装的获取实时交通的方法
export const getRealTimeTraffic = ($map,show) => {
  const carFlow_blue = {
    type: "FeatureCollection",
    features: [],
  };
  const carFlow_green = {
    type: "FeatureCollection",
    features: [],
  };
  const carFlow_yellow = {
    type: "FeatureCollection",
    features: [],
  };
  const carFlow_orange = {
    type: "FeatureCollection",
    features: [],
  };
  const carFlow_red = {
    type: "FeatureCollection",
    features: [],
  };

  // 获取要素
  var features = $map.queryRenderedFeatures({ layers: ["roadLayer"] });
  // 造数据
  features.forEach((item) => {
    // console.log(item.geometry);
    let trafficFlow = JSON.parse(item.properties.values_).车流量;
    if (trafficFlow < 900) {
      carFlow_blue.features.push({
        type: item.type,
        geometry: item.geometry,
        properties: JSON.parse(item.properties.values_),
      });
    } else if (trafficFlow < 1200) {
      carFlow_green.features.push({
        type: item.type,
        geometry: item.geometry,
        properties: JSON.parse(item.properties.values_),
      });
    } else if (trafficFlow < 1500) {
      carFlow_yellow.features.push({
        type: item.type,
        geometry: item.geometry,
        properties: JSON.parse(item.properties.values_),
      });
    } else if (trafficFlow < 1800) {
      carFlow_orange.features.push({
        type: item.type,
        geometry: item.geometry,
        properties: JSON.parse(item.properties.values_),
      });
    } else {
      carFlow_red.features.push({
        type: item.type,
        geometry: item.geometry,
        properties: JSON.parse(item.properties.values_),
      });
    }
  });

  if (show) {
    $map.addLayer({
      id: "layer-red",
      source: {
        type: "geojson",
        data: carFlow_red,
      },
      type: "line",
      paint: {
        "line-color": "#ff0000",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });
    $map.addLayer({
      id: "layer-orange",
      source: {
        type: "geojson",
        data: carFlow_orange,
      },
      type: "line",
      paint: {
        "line-color": "orange",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });
    $map.addLayer({
      id: "layer-yellow",
      source: {
        type: "geojson",
        data: carFlow_yellow,
      },
      type: "line",
      paint: {
        "line-color": "yellow",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });
    $map.addLayer({
      id: "layer-green",
      source: {
        type: "geojson",
        data: carFlow_green,
      },
      type: "line",
      paint: {
        "line-color": "green",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });
    $map.addLayer({
      id: "layer-blue",
      source: {
        type: "geojson",
        data: carFlow_blue,
      },
      type: "line",
      paint: {
        "line-color": "blue",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });
    // map.removeLayer("road-layer");
  } else {
    // map.addLayer("road-layer");
    $map.removeLayer("layer-blue");
    $map.removeLayer("layer-green");
    $map.removeLayer("layer-yellow");
    $map.removeLayer("layer-orange");
    $map.removeLayer("layer-red");

    //删除source (不删除会影响下一次添加layers)
    $map.removeSource("layer-red");
    $map.removeSource("layer-orange");
    $map.removeSource("layer-yellow");
    $map.removeSource("layer-green");
    $map.removeSource("layer-blue");
  }
};