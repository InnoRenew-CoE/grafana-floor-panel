/* eslint-disable eol-last */

export type Point2D = {
    x: number,
    y: number
}

export type Room = CanvasElement & {
    lines: Line[],
    quality: number,
    name: string
}

export type CanvasElement = {
    position: Point2D,
    rotation: number,
    type: CanvasElementType
}

export type Door = CanvasElement
export type Window = CanvasElement

export type Line = {
    start: Point2D,
    end: Point2D,
    // type: string
}

export enum ActionState {
    Drawing = "Drawing",
    None = "None",
}

export enum GridPosition {
    Left, Right, Center, Top, Bottom
}

export enum CanvasElementType {
    Door = "Door",
    Window = "Window",
    Room = "Room"
}
