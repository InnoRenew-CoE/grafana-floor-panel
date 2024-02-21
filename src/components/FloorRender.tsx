import {CanvasElement, CanvasElementType, GridPosition, Line, Point2D, Room} from "../@types/Graphics";
import Polygon from "polygon";

export let interval;

export class FloorRenderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    interval: number = 0;

    centerPosition: Point2D = {x: 0, y: 0}
    canvasOffset: Point2D = {x: 0, y: 0}

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!!;
        console.log(`Floor Renderer constructor! ${this.canvas} ... ${this.ctx}`)
        let currentSign = 1;
        clearInterval(interval);
        interval = setInterval(() => {
            const room = this.rooms[0];
            if (room.quality >= 255) currentSign = -1;
            if (room.quality <= 0) currentSign = 1;
            this.rooms[0].quality += currentSign;
            this.redraw()
        }, 10)
    }

    public dpiFix(windowWidth: number, windowHeight: number) {
        const width = windowWidth
        const height = windowHeight
        const ratio = Math.ceil(window.devicePixelRatio);
        this.pointSize = width / 50;

        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.scale(ratio, ratio)
        this.setCenter()
        this.redraw()
    }

    public objects: CanvasElement[] = [{
        type: CanvasElementType.Door,
        position: {x: -4, y: -5},
        rotation: 0
    }];

    public testRoom: Room = {
        quality: 0,
        lines: [
            {start: {x: -5, y: -5}, end: {x: -5, y: 5}},
            {start: {x: -5, y: 5}, end: {x: 5, y: 5}},
            {start: {x: 5, y: 5}, end: {x: 5, y: -5}},
            {start: {x: 5, y: -5}, end: {x: -5, y: -5}},
        ],
        position: {x: 0, y: 0},
        rotation: 0,
        type: CanvasElementType.Room
    }
    public rooms: Room[] = [this.testRoom];

    public minimumPointSize = 20
    public pointSize = this.minimumPointSize
    public lineWidth: number = 1 / 3 * this.pointSize
    public scale = 1.0;
    public halfPointSize: number = this.pointSize / 2

    public setCenter() {
        let clientWidth = this.canvas.clientWidth
        let clientHeight = this.canvas.clientHeight
        this.centerPosition = {x: clientWidth / 2, y: clientHeight / 2}
        this.canvasOffset = this.centerPosition
    }

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


    public transformRealToFake = (point: Point2D) => {
        const absolutePosition = {x: point.x - this.canvasOffset.x, y: this.canvasOffset.y - point.y}
        return {x: Math.round(absolutePosition.x / this.pointSize), y: Math.round(absolutePosition.y / this.pointSize)}
    }

    public drawRoom(room: Room) {
        const ctx = this.ctx;
        this.colorRoom(room)
        ctx.beginPath()
        room.lines.forEach(line => this.drawLine(line))
        ctx.strokeStyle = "black"
        ctx.lineWidth = this.lineWidth
        ctx.stroke();
        const polygon = new Polygon(room.lines.map(x => x.start));
        const polygonArea = polygon.area()
        ctx.fillStyle = "white"
        room.lines.forEach((line) => this.displayLineDistance(line, undefined, polygon))
        const polygonCenter = polygon.center()
        const roomCenter = {x: polygonCenter.x, y: polygonCenter.y}
        const transformed = this.transformFakeToDrawable(roomCenter);
        const text = `${Math.abs(polygonArea / (this.pointSize * this.pointSize) * 100).toFixed(1)}m`;
        const metrics = this.ctx.measureText(text);
        ctx.fillText(text, transformed.x, transformed.y)
        ctx.font = `${this.halfPointSize * 0.8}px Arial`
        ctx.fillText("2", transformed.x + metrics.actualBoundingBoxRight + 5, transformed.y - metrics.fontBoundingBoxAscent)
    }

    public colorRoom(room: Room) {
        if (room.lines.length <= 2) {
            return
        }
        const startPoint = room.lines[0].start;
        const lastPoint = room.lines[room.lines.length - 2].start;
        const transformedStartPoint = this.transformFakeToDrawable(startPoint);
        const transformedLastPoint = this.transformFakeToDrawable(lastPoint);
        const grd = this.ctx.createLinearGradient(transformedStartPoint.x, transformedStartPoint!.y, transformedLastPoint.x, transformedLastPoint.y)
        grd.addColorStop(0, `rgb(${room.quality}, ${Math.abs(255 - room.quality)}, 0, 1`)
        grd.addColorStop(1, `rgb(${room.quality}, ${Math.abs(255 - room.quality)}, 100, 1`)
        this.ctx.fillStyle = grd
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

    public drawLine(line: Line) {
        const startTransformed = this.transformFakeToDrawable(line.start)
        const endTransformed = this.transformFakeToDrawable(line.end)
        this.ctx.lineCap = "round"
        this.ctx.moveTo(startTransformed.x, startTransformed.y)
        this.ctx.lineTo(endTransformed.x, endTransformed.y);
        // ctx.fillText(`${JSON.stringify(direction)} = ${xPos, yPos}`, endTransformed.x + 200, endTransformed.y + 0.1 * direction.y)
    }


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


    public getLineDirection(line: Line) {
        const {start, end} = line;
        return {x: end.x - start.x, y: end.y - start.y};
    }

    public drawObjects() {
        for (let canvasObject of this.objects) {
            if (canvasObject.type === CanvasElementType.Door) {
                const doorCenter = this.transformFakeToDrawable(canvasObject.position)
                const rotation = canvasObject.rotation
                let ctx = this.ctx
                ctx.strokeStyle = "black";
                ctx.lineWidth = this.pointSize * 0.15
                ctx.strokeStyle = "rgba(255,255,255, .5)"
                ctx.setLineDash([5])
                ctx.beginPath()
                ctx.moveTo(doorCenter.x, doorCenter.y)
                ctx.arc(doorCenter.x, doorCenter.y, 2 * this.pointSize, Math.PI * (rotation - 0.5), Math.PI * rotation)
                ctx.stroke()
                ctx.setLineDash([])
                ctx.strokeStyle = "white"
                ctx.lineWidth = this.lineWidth * 1.05
                ctx.lineCap = "square"
                ctx.beginPath()
                ctx.moveTo(doorCenter.x, doorCenter.y);
                ctx.lineTo(doorCenter.x + 2 * this.pointSize, doorCenter.y);
                ctx.stroke()
            }
        }
    }

}