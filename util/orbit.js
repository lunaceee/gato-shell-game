function orbit(center, radius, radians) {
  const orbitX = center.x + radius * Math.cos(radians);
  const orbitY = center.y + radius * Math.sin(radians);
  return new Point(orbitX, orbitY);
}
