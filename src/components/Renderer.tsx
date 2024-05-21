import Polygon from "polygon";
import {GridPosition, Point2D, Room} from "../@types/Graphics";
import Clean from "img/clean.svg"

export class Renderer {

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scale = 1;
    minimumPointSize = 1;
    pointSize: number = this.minimumPointSize;
    centerPoint: Point2D = {x: 0, y: 0};
    floorPlanImage: HTMLImageElement;
    oldWidth: number;
    oldHeight: number;
    width: number;
    height: number;
    rooms: Room[] = [];

    public setup(canvas: HTMLCanvasElement, image: string, width: number, height: number) {
        if (!canvas || (this.oldWidth === width && this.oldHeight === height)) return;
        this.canvas = canvas;
        this.oldWidth = width;
        this.oldHeight = height;
        this.width = width;
        this.height = height;
        this.ctx = canvas.getContext('2d')!;
        this.dpiFix(width, height)
        this.setCenter(this.canvas)
        this.redraw()
    }

    public setRooms(rooms: Room[]) {
        this.rooms = rooms;
    }

    public drawBackground() {
        const maxSize = Math.min(this.width, this.height) * this.scale;
        const xOffset = this.centerPoint.x - (maxSize / 2);
        const yOffset = this.centerPoint.y - (maxSize / 2);
        this.pointSize = 0.00145 * maxSize
        if (!this.floorPlanImage) {
            let img = new Image();
            img.onload = () => {
                this.floorPlanImage = img;
                this.drawBackground()
            }
            img.src = Clean
        } else {
            this.ctx.drawImage(this.floorPlanImage, xOffset, yOffset, maxSize, maxSize)
        }
    }

    public redraw() {
        const context = this.ctx;
        const halfPointSize = this.pointSize / 2;
        context.clearRect(0, 0, this.width, this.height)
        context.fillRect(this.centerPoint.x - halfPointSize, this.centerPoint.y - halfPointSize, this.pointSize, this.pointSize);
        context.fillStyle = "white"
        context.fillRect(0, 0, this.width, this.height);
        for (let room of this.rooms) this.drawRoom(room)
        this.drawBackground()
    }


    public drawRoom(room: Room) {
        const ctx = this.ctx;
        this.colorRoom(room)
        const polygon = new Polygon(room.lines.map(x => x.start));
        ctx.fillStyle = "white"
        const polygonCenter = polygon.center()
        const roomCenter = {x: polygonCenter.x, y: polygonCenter.y}
        const transformed = this.fakeToReal(roomCenter);
        const text = room.name;
        const metrics = this.ctx.measureText(text);
        ctx.font = `${this.pointSize * 3}px Arial`
        ctx.fillText(room.name, transformed.x - metrics.width / 2, transformed.y)
    }

    public colorRoom(room: Room) {
        if (room.lines.length <= 2) return
        const startPoint = room.lines[0].start;
        const lastPoint = room.lines[room.lines.length - 2].start;
        const transformedStartPoint = this.fakeToReal(startPoint);
        const transformedLastPoint = this.fakeToReal(lastPoint);
        const grd = this.ctx.createLinearGradient(transformedStartPoint.x, transformedStartPoint!.y, transformedLastPoint.x, transformedLastPoint.y)
        grd.addColorStop(0, `rgb(112, 171, 153)`)
        grd.addColorStop(1, `rgb(9, 230, 164)`)
        this.ctx.fillStyle = grd && room.quality === 0 ? "rgba(255,19,60,0.5)" : grd;
        this.ctx.beginPath()
        this.ctx.moveTo(transformedStartPoint.x, transformedStartPoint.y)
        room.lines.forEach(({start, end}) => {
            const transformedEnd = this.fakeToReal(end!)
            this.ctx.lineTo(transformedEnd.x, transformedEnd.y)
        })
        this.ctx.moveTo(transformedStartPoint.x, transformedStartPoint.y)
        this.ctx.closePath()
        this.ctx.fill()
    }

    private setCenter(canvas: HTMLCanvasElement) {
        this.centerPoint.x = canvas.width / 4
        this.centerPoint.y = canvas.height / 4
    }

    public setScale(scale: number) {
        this.scale = Math.min(Math.max(1, scale), 10);
        this.pointSize = this.minimumPointSize * this.scale
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
        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.ctx.scale(ratio, ratio)
    }


    public fakeToReal = (point: Point2D, xPosition: GridPosition = GridPosition.Center, yPosition: GridPosition = GridPosition.Center) => {
        let addX = 0, addY = 0;
        const pointSize = this.pointSize;
        const halfPointSize = pointSize / 2;
        if (xPosition === GridPosition.Right) addX = pointSize;
        if (xPosition === GridPosition.Center) addX = halfPointSize;

        if (yPosition === GridPosition.Bottom) addY = pointSize
        if (yPosition === GridPosition.Center) addY = halfPointSize
        return {x: (point.x * pointSize + this.centerPoint.x - halfPointSize) + addX, y: (-point.y * pointSize + this.centerPoint.y) - halfPointSize + addY}
    }

    public realToFake = (point: Point2D) => {
        const pointSize = this.pointSize;
        const absolutePosition = {x: point.x - this.centerPoint.x, y: this.centerPoint.y - point.y}
        return {x: Math.round(absolutePosition.x / pointSize), y: Math.round(absolutePosition.y / pointSize)}
    }

    public findRoomUnderMouse(mousePosition: Point2D) {
        return this.rooms.find(room => {
            const roomPoints = room.lines.map(x => this.fakeToReal(x.end!))
            const polygon = new Polygon(roomPoints);
            return polygon.contains({x: mousePosition.x, y: mousePosition.y, width: 1, height: 1});
        })
    }

}