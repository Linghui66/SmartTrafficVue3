/**
 * @param {Array} position  = [[114,30],[120,40]...]
 * @param {Array}  attr =[{name:"name",type:"string",value:"武汉"}]
 * @param {Object} service = {name:"xxx",layerId:xx}
 */
class LineString {
  static add({ position, attr, service, docLayer }) {
    // var pointObj = new Array();
    var pointObj = position.map((item) => {
      return new Zondy.Object.Point2D(item[0], item[1]);
    });
    //构成折线的弧段
    var gArc = new Zondy.Object.Arc(pointObj);
    //构成线的折线
    var gAnyLine = new Zondy.Object.AnyLine([gArc]);
    //设置线要素的几何信息
    var gline = new Zondy.Object.GLine(gAnyLine);
    //设置要素的几何信息
    var fGeom = new Zondy.Object.FeatureGeometry({ LinGeom: [gline] });
    /* 1-2、style  webGraphic */
    //设置添加线要素的图形参数信息
    var clineInfo = new Zondy.Object.CLineInfo({
      Color: 1, //线的颜色
      LinStyleID: 0, //线型号
      LinStyleID2: 18, //线型号
      LinWidth: 0.05, //线宽
      Xscale: 10,
      Yscale: 10,
    });
    //设置要素的图形参数信息
    var graphicInfo = new Zondy.Object.WebGraphicsInfo({
      InfoType: 2,
      LinInfo: clineInfo,
    });
    /* 1-3、属性 */
    var attValue = attr.map((item) => item.value);
    //创建一个线要素
    var newFeature = new Zondy.Object.Feature({
      fGeom: fGeom,
      GraphicInfo: graphicInfo,
      AttValue: attValue,
    });
    //设置要素为线要素
    newFeature.setFType(2);
    /* 2、构建要素 --和数据库中图层映射 */
    var featureSet = new Zondy.Object.FeatureSet();
    var fldNumber = attr.length; //属性个数
    var fldName = attr.map((item) => item.name);
    var fldType = attr.map((item) => item.type);
    //创建属性结构设置对象
    var cAttStruct = new Zondy.Object.CAttStruct({
      FldName: fldName,
      FldNumber: fldNumber,
      FldType: fldType,
    });
    //设置要素数据集的树形结构
    featureSet.AttStruct = cAttStruct;
    //将添加的线要素添加到属性数据集中
    featureSet.addFeature(newFeature);
    /* 3、调服务 */
    //创建一个地图编辑对象
    var editDocFeature = new Zondy.Service.EditDocFeature(
      service.name,
      service.layerId,
      {}
    );
    editDocFeature.add(featureSet, this.onLineSuccess(docLayer));
  }
  static onLineSuccess(docLayer) {
    return function (data) {
      console.log(data);
      if (data.succeed) {
        alert("添加要素成功！");
        docLayer.refresh();
      } else {
        alert("添加要素失败！");
      }
    };
  }
}
