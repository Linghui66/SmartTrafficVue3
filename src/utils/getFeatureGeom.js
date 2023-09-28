export function getFeatureGeom(feature) {
  return feature.getGeometry().getCoordinates()
}