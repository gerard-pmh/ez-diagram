export interface Point {
  x: number;
  y: number;
}

export interface Corner extends Point, RelativePosition {}

export interface Border extends RelativePosition {
  a: Point;
  b: Point;
}

export function rectCorners(rect: Rectangle): Corner[] {
  const { x, y, width, height } = rect;
  return [
    { x, y, horizontal: "left", vertical: "top" },
    { x: x + width, y, horizontal: "right", vertical: "top" },
    { x, y: y + height, horizontal: "left", vertical: "bottom" },
    { x: x + width, y: y + height, horizontal: "right", vertical: "bottom" },
  ];
}

export function rectBorders(rect: Rectangle): Border[] {
  const { x, y, width, height } = rect;
  return [
    {
      a: { x, y },
      b: { x: x + width, y },
      horizontal: "middle",
      vertical: "top",
    },
    {
      a: { x, y },
      b: { x, y: y + height },
      horizontal: "right",
      vertical: "middle",
    },
    {
      a: { x, y: y + height },
      b: { x: x + width, y: y + height },
      horizontal: "middle",
      vertical: "bottom",
    },
    {
      a: { x: x + width, y },
      b: { x: x + width, y: y + height },
      horizontal: "left",
      vertical: "middle",
    },
  ];
}

export interface Circle extends Point {
  radius: number;
}

export function dist(a: Point, b: Point) {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

export function pointIntersectRect(point: Point, rect: Rectangle): boolean {
  return (
    point.x > rect.x &&
    point.x < rect.x + rect.width &&
    point.y > rect.y &&
    point.y < rect.y + rect.height
  );
}

export function pointIntersectCircle(point: Point, circle: Circle): boolean {
  return dist(point, circle) < circle.radius;
}

export function pointIntersectRectCorner(
  point: Point,
  rect: Rectangle,
  radius: number
): Corner | undefined {
  return rectCorners(rect).find((corner) =>
    pointIntersectCircle(point, { ...corner, radius })
  );
}

export function pointIntersectRectBorder(
  point: Point,
  rect: Rectangle,
  padding: number
): Border | undefined {
  return rectBorders(rect).find((border) => {
    console.log(rect);
    console.log(border);
    let hitbox: Rectangle;
    if (border.horizontal === "middle") {
      hitbox = {
        x: border.a.x,
        y: border.a.y - padding / 2,
        width: rect.width,
        height: padding,
      };
    } else {
      hitbox = {
        x: border.a.x - padding / 2,
        y: border.a.y,
        width: padding,
        height: rect.height,
      };
    }
    pointIntersectRect(point, hitbox);
  });
}
