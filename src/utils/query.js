/**
 * @param {Function} success 成功的回调
 */
class Query {
  static queryByPoint({ position, service, success }) {
    var pointObj = new Zondy.Object.Point2D(position[0], position[1]);
    //设置查询点的搜索半径
    pointObj.nearDis = 2;
    /* 1、设置查询结构 */

    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    /* 2、设置查询规则 */
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    });
    /* 3、设置查询参数 */
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: pointObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    /* 4、调用查询服务 */
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }
  //geometry是 ol的要素的属性参数
  static queryByGeom({ geometry, service, success }) {
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    var geomObj = new Zondy.Object.Polygon();
    geomObj.setByOL(geometry);
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      geometry: geomObj,
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 1000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，success为查询回调函数
    queryService.query(success);
  }
  /*
   * server{name:string,layerId:number|array}
   */
  static queryByLayer({ service, success }) {
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    var rule = new Zondy.Service.QueryFeatureRule({
      //是否将要素的可见性计算在内
      EnableDisplayCondition: false,
      //是否完全包含
      MustInside: false,
      //是否仅比较要素的外包矩形
      CompareRectOnly: false,
      //是否相交
      Intersect: true,
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
      rule: rule,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 1000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }

  static queryByAttr({ keyword, service, success }) {
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      resultFormat: "json",
      struct: queryStruct,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //queryParam.where = name;  sql
    /* 获取name值包含汉的这个关键字 */
    queryParam.where = `name like '%${keyword}%'`;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(success);
  }
  /* fids {Array|number} */
  static queryByFids({ fids, service, callback }) {
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    /* 2、查询参数 */
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter({
      objectIds: fids,
      resultFormat: "json",
      struct: queryStruct,
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    /* 3、调用查询服务 */
    var queryService = new Zondy.Service.QueryDocFeature(
      queryParam,
      service.name,
      service.layerId,
      {}
    );
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(this.querySuccess(callback));
  }
  static querySuccess(callback) {
    return function (data) {
      var format = new Zondy.Format.PolygonJSON();
      //将MapGIS要素JSON反序列化为ol.Feature类型数组
      var features = format.read(data);
      callback(features);
    };
  }
}
export { Query }