/**
 * @param {Array} position =[120,40]
 * @param {Array}  attr =[{name:"name",type:"string",value:"武汉"}]
 * @param {Object} service = {name:"xxx",layerId:xx}
 */
class Point {
  static add({ position, attr, service, docLayer }) {
    var gpoint = new Zondy.Object.GPoint(position[0], position[1]); //createPoint();
    //设置当前点要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ PntGeom: [gpoint] });
    // var point = new ol.Feature({
    //     geometry:new ol.geom.Point()
    // })
    /* 1-2、样式  图形参数信息 */
    var pointInfo = new Zondy.Object.CPointInfo({
      Angle: 0,
      Color: 11, //子图颜色
      Space: 0,
      SymHeight: 5, //高度
      SymID: 31, //子图号
      SymWidth: 5, //宽度
    });
    //设置当前点要素的图形参数信息
    var webGraphicInfo = new Zondy.Object.WebGraphicsInfo({
      /* 1-point  2--LineString  3--Area */
      InfoType: 1,
      PntInfo: pointInfo,
    });
    /* 1-3、属性 */
    var attValue = attr.map((item) => item.value);
    //创建一个要素
    var feature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: webGraphicInfo,
      AttValue: attValue,
    });
    //设置要素为点要素
    feature.setFType(1);
    /* 2、创建要素集 */
    //创建一个要素数据集
    var featureSet = new Zondy.Object.FeatureSet();
    //设置属性结构
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: attr.map((item) => item.name),
      FldNumber: attr.length,
      FldType: attr.map((item) => item.type),
    });
    featureSet.AttStruct = cAttStruct;
    //添加要素到要素数据集
    featureSet.addFeature(feature);
    /* 3、调用服务添加要素 */
    /* 第一个参数 igserver服务的名称
        第二个参数 是添加要素所在的图层
       */
    var editService = new Zondy.Service.EditDocFeature(
      service.name,
      service.layerId,
      {}
    );
    //执行添加点要素功能
    editService.add(featureSet, this.onPntSuccess(docLayer));
  }
  static onPntSuccess(docLayer) {
    return function (data) {
      if (data.succeed) {
        alert("添加点要素成功！");
        docLayer.refresh();
      } else {
        alert("添加点要素失败！");
      }
    };
  }
}
