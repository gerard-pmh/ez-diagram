import type { Point } from "./shapes"

export interface Link {
  a: Point;
  b: Point;
  
}



export type LinkType = 'convex' | 'middle' | 'concave'



function drawConvexLink() {

}
