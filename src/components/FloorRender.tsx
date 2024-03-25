import {CanvasElement, CanvasElementType, GridPosition, Line, Point2D, Room} from "../@types/Graphics";
import Polygon from "polygon";
import Rainbow from "rainbowvis.js";
import WindowImage from "img/window-path.svg"
import DoubleDoorsImage from "img/double-doors.svg"
import SingleDoorsImage from "img/single-door.svg"
import StairsImage from "img/stairs.svg"

export let interval;

export class FloorRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    interval = 0;
    displayMeasurements = false;
    rainbow: Rainbow;
    windowImage = new Image();
    singleDoorImage = new Image();
    doubleDoorImage = new Image();
    stairsImage = new Image();
    centerPosition: Point2D = {x: 0, y: 0}
    canvasOffset: Point2D = {x: 0, y: 0}

    public objects: CanvasElement[] = [];
    public rooms: Room[] = [];

    public minimumPointSize = 20
    public pointSize = this.minimumPointSize
    public lineWidth: number = 1 / 3 * this.pointSize
    public scale = 1.0;
    public halfPointSize: number = this.pointSize / 2

    constructor() {
        this.rainbow = new Rainbow();
        this.objects = [];
        this.rooms = [];
        this.windowImage.src = `${WindowImage}`;
        this.singleDoorImage.src = `${SingleDoorsImage}`;
        this.doubleDoorImage.src = `${DoubleDoorsImage}`;
        this.stairsImage.src = `${StairsImage}`;
        setTimeout(() => this.redraw(), 500) // Redraw after the initial creation after all SVGs have loaded.
    }

    /**
     * Sets the canvas element reference as well as the canvas 2D context.
     * @param canvas
     */
    public setCanvasNode(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!!;
    }

    /**
     * Creates a rainbow that spans across colors.
     * @param colors
     */
    public setColors(colors: string[]) {
        this.rainbow.setSpectrumByArray(colors);
    }

    /**
     * Sets DPI, point size and scale of the canvas to provide crisp drawings.
     * @param windowWidth
     * @param windowHeight
     */
    public dpiFix(windowWidth: number, windowHeight: number) {
        const width = windowWidth
        const height = windowHeight
        const ratio = Math.ceil(window.devicePixelRatio);
        this.pointSize = 20;
        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.scale(ratio, ratio)
        this.setCenter()
        this.redraw()
    }

    /**
     * Sets the center position (used for canvas drawing) based on canvas dimensions.
     */
    public setCenter() {
        let clientWidth = this.canvas.clientWidth
        let clientHeight = this.canvas.clientHeight
        this.centerPosition = {x: clientWidth / 2, y: clientHeight / 2}
    }

    /**
     * Clears and redraws the whole canvas.
     */
    public redraw() {
        const ctx = this.ctx;
        if (ctx) {
            ctx.clearRect(0, 0, 10000, 10000)
            this.setCenter()
            this.rooms.forEach(room => {
                this.drawRoom(room);
            })
            this.drawObjects()
        }
    }

    /**
     * Transforms fake coordinate point (0,0 center) to the drawable coordinate point (canvas coordinate system).
     * @param point
     * @param xPosition
     * @param yPosition
     */
    public transformFakeToDrawable = (point: Point2D, xPosition: GridPosition = GridPosition.Center, yPosition: GridPosition = GridPosition.Center) => {
        let addX = 0, addY = 0;
        if (xPosition === GridPosition.Right) {
            addX = this.pointSize
        }
        if (xPosition === GridPosition.Center) {
            addX = this.halfPointSize;
        }

        if (yPosition === GridPosition.Bottom) {
            addY = this.pointSize
        }
        if (yPosition === GridPosition.Center) {
            addY = this.halfPointSize
        }

        return {x: (point.x * this.pointSize + this.canvasOffset.x - this.halfPointSize) + addX, y: (-point.y * this.pointSize + this.canvasOffset.y) - this.halfPointSize + addY}
    }

    /**
     * Transforms real 2D point (canvas coordinate system) to fake coordinate system (0,0 center).
     * @param point
     */
    public transformRealToFake = (point: Point2D) => {
        const absolutePosition = {x: point.x - this.canvasOffset.x, y: this.canvasOffset.y - point.y}
        return {x: Math.round(absolutePosition.x / this.pointSize), y: Math.round(absolutePosition.y / this.pointSize)}
    }

    /**
     * Draws a room in the coordinate system using drawLine function.
     * @param room
     */
    public drawRoom(room: Room) {
        const ctx = this.ctx;
        this.colorRoom(room);
        ctx.beginPath()
        room.lines.forEach(line => this.drawLine(line))
        ctx.strokeStyle = "black"
        ctx.lineWidth = this.lineWidth
        ctx.stroke();
        const polygon = new Polygon(room.lines.map(x => x.start));
        const polygonArea = polygon.area()
        ctx.fillStyle = "white"
        const polygonCenter = polygon.center()
        const roomCenter = {x: polygonCenter.x, y: polygonCenter.y}
        const transformed = this.transformFakeToDrawable(roomCenter);

        if (this.displayMeasurements) {
            room.lines.forEach((line) => this.displayLineDistance(line, undefined, polygon))
            const roomCenter = {x: polygonCenter.x, y: polygonCenter.y}
            const transformed = this.transformFakeToDrawable(roomCenter);
            const text = `${Math.abs(polygonArea / (this.pointSize * this.pointSize) * 100).toFixed(1)}m`;
            const metrics = this.ctx.measureText(text);
            ctx.fillText(text, transformed.x, transformed.y)
            ctx.font = `${this.halfPointSize * 0.8}px Arial`
            ctx.fillText("2", transformed.x + metrics.actualBoundingBoxRight + 5, transformed.y - metrics.fontBoundingBoxAscent)
        }
        const text = room.name;
        const metrics = this.ctx.measureText(text);
        ctx.font = `${this.pointSize * 0.8}px Arial`
        ctx.fillText(room.name, transformed.x - metrics.width / 2, transformed.y)
    }

    /**
     * Colors room based on room air quality and colors set to the class colors array.
     * @param room
     */
    public colorRoom(room: Room) {
        if (room.lines.length <= 2) {
            return
        }
        const startPoint = room.lines[0].start;
        const lastPoint = room.lines[room.lines.length - 2].start;
        const transformedStartPoint = this.transformFakeToDrawable(startPoint);
        const transformedLastPoint = this.transformFakeToDrawable(lastPoint);
        const grd = this.ctx.createLinearGradient(transformedStartPoint.x, transformedStartPoint!.y, transformedLastPoint.x, transformedLastPoint.y)

        if (room.quality > 0) {
            grd.addColorStop(0, `#${this.rainbow.colorAt(room.quality - 10)}`)
            grd.addColorStop(0.5, `#${this.rainbow.colorAt(room.quality)}`)
            grd.addColorStop(1, `#${this.rainbow.colorAt(room.quality + 10)}`)
        }
        this.ctx.fillStyle = room.quality > 0 ? grd : "rgba(255,255,255, .1)"
        this.ctx.beginPath()
        this.ctx.moveTo(transformedStartPoint.x, transformedStartPoint.y)
        room.lines.forEach(({start, end}) => {
            const transformedEnd = this.transformFakeToDrawable(end)
            this.ctx.lineTo(transformedEnd.x, transformedEnd.y)
        })
        this.ctx.moveTo(transformedStartPoint.x, transformedStartPoint.y)
        this.ctx.closePath()
        this.ctx.fill()
    }

    /**
     * Draws a straight line using the wall size.
     * @param line
     */
    public drawLine(line: Line) {
        const startTransformed = this.transformFakeToDrawable(line.start)
        const endTransformed = this.transformFakeToDrawable(line.end)
        this.ctx.lineCap = "round"
        this.ctx.moveTo(startTransformed.x, startTransformed.y)
        this.ctx.lineTo(endTransformed.x, endTransformed.y);
        // ctx.fillText(`${JSON.stringify(direction)} = ${xPos, yPos}`, endTransformed.x + 200, endTransformed.y + 0.1 * direction.y)
    }

    /**
     * Draws the text with line distance in meters at the specific text position.
     * @param line
     * @param textPosition
     * @param polygon
     */
    public displayLineDistance(line: Line, textPosition: Point2D | undefined = undefined, polygon: Polygon | undefined = undefined) {
        const {start, end} = line
        let direction = this.getLineDirection(line);
        let xAdd = 0, yAdd = 0;
        const distance = Math.sqrt(Math.abs((start.x - end.x)) ** 2 + Math.abs(start.y - end.y) ** 2);
        const centerPoint = {x: (end.x + start.x) / 2, y: (end.y + start.y) / 2}
        const transformedCenter = this.transformFakeToDrawable(centerPoint);

        if (polygon) {
            const {x, y} = polygon.center();
            const polyCenter: Point2D = {x: x, y: y}
            direction = this.getLineDirection({start: centerPoint, end: polyCenter})
        }
        xAdd = direction.x === 0 ? 0 : Math.sign(direction.x) * this.pointSize;
        yAdd = direction.y === 0 ? 0 : -Math.sign(direction.y) * this.halfPointSize * 1.25;
        let ctx = this.ctx;
        ctx.font = `${this.halfPointSize}px Verdana`;
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${(distance / 2).toFixed(1)}m`, textPosition?.x ?? (transformedCenter.x + xAdd), textPosition?.y ?? (transformedCenter.y + yAdd))
    }

    /**
     * Returns line direction where x can be 1 (right) 0 (none) or -1 (left). And y can be 1 (up) 0 (none) or -1 (down).
     * @param line
     */
    public getLineDirection(line: Line) {
        const {start, end} = line;
        return {x: end.x - start.x, y: end.y - start.y};
    }

    /**
     * Draws all objects from the objects array.
     */
    public drawObjects() {
        let ctx = this.ctx
        if (!ctx) return;
        for (let canvasObject of this.objects) {
            const objectDistance = canvasObject.type === CanvasElementType.Stairs ? 6 : 2.5;
            let xAdd = 0;
            let yAdd = 0;
            if (canvasObject.rotation == 0) xAdd = 1;
            if (canvasObject.rotation == 0.5) yAdd = 1;
            if (canvasObject.rotation == 1) xAdd = -1;
            if (canvasObject.rotation == 1.5) yAdd = -1;
            const objectCenter = this.transformFakeToDrawable(canvasObject.position)
            const rotation = canvasObject.rotation
            ctx.save()
            ctx.translate(
                objectCenter.x - this.pointSize,
                objectCenter.y - this.pointSize
            );
            ctx.rotate(Math.PI * rotation);
            let image = this.singleDoorImage;
            switch (canvasObject.type) {
                case CanvasElementType.Door:
                    image = this.singleDoorImage;
                    break;
                case CanvasElementType.Window:
                    image = this.windowImage;
                    break;
                case CanvasElementType.DoubleDoor:
                    image = this.doubleDoorImage;
                    break;
                case CanvasElementType.Stairs:
                    image = this.stairsImage;
                    break;
            }
            ctx.drawImage(image,
                -objectDistance / 2 * this.pointSize,
                -objectDistance / 2 * this.pointSize,
                objectDistance * this.pointSize,
                objectDistance * this.pointSize);
            ctx.restore()
        }
    }

    /**
     * Draws the grid with relative scale (zoom and window size).
     * @param windowWidth
     * @param windowHeight
     */
    public drawGrid(windowWidth, windowHeight) {
        const ctx = this.ctx
        const pointSize = this.pointSize;
        const numberOfColumns = windowWidth / pointSize
        const numberOfRows = windowHeight / pointSize
        const lineWidth = this.pointSize / 100;
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeStyle = `rgba(0, 0, 0, 0.1)`;
        //ctx.strokeStyle = `rgba(0,0,0, 0)`;
        for (let i = -windowHeight; i < windowWidth; i++) {
            ctx.beginPath()
            const x = i * pointSize + this.canvasOffset.x + this.halfPointSize - lineWidth / 2
            ctx.strokeText(`${i}`, x - pointSize * 5 / 8, 50)
            ctx.moveTo(x, 0);
            ctx.lineTo(x, windowHeight);
            ctx.closePath()
            ctx.stroke()
        }
        for (let i = -windowWidth; i < windowHeight; i++) {
            const y = -i * pointSize + this.canvasOffset.y - this.halfPointSize + lineWidth / 2
            ctx.strokeText(`${i}`, 50, y + pointSize * 5 / 8)
            ctx.beginPath()
            ctx.moveTo(0, y);
            ctx.lineTo(windowWidth, y);
            ctx.closePath()
            ctx.stroke()
        }

    }

}