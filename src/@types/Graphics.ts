/* eslint-disable eol-last */

export type Point2D = {
    x: number,
    y: number
}

export type Room = {
    quality: number,
    name: string
}

export type Line = {
    start: Point2D,
    end: Point2D,
    // type: string
}

export enum GridPosition {
    Left, Right, Center, Top, Bottom
}