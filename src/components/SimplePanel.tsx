import React, {useCallback, useEffect, useState} from 'react';
import {colorManipulator, DataFrame, FieldColorModeId, fieldColorModeRegistry} from '@grafana/data';
import {css, cx} from '@emotion/css';
import {useStyles2, useTheme2} from '@grafana/ui';
import {FloorRenderer} from "./FloorRender";
import {CanvasElement, Room} from "../@types/Graphics";
import {Measurement, SensorData} from "../@types/QueryData";
import {parseInt, toNumber} from "lodash";
import {Props} from "../@types/PanelProps";
import {getStyles} from "./PanelStyle";
import {SimpleOptions} from "../types";
import {RoomDrawer} from "./RoomDrawer";

export const SimplePanel: React.FC<Props> = ({options, data, width, height, fieldConfig}) => {
    const fieldColor = fieldConfig.defaults.color || {mode: FieldColorModeId.ContinuousGrYlRd};
    const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);
    const [roomMetrics] = useState(() => new Map<string, number>());
    const [interval] = useState({id: 0});
    const [floorRenderer] = useState(() => new FloorRenderer());
    const [currentRoom, setCurrentRoom] = useState(() => undefined as (Room | undefined))

    const jsonData: { rooms: Room[], objects: CanvasElement[] } = JSON.parse(options["json"]);
    if (floorRenderer.rooms.length === 0) {
        floorRenderer.rooms = jsonData.rooms;
        floorRenderer.objects = jsonData.objects;
    }

    const selectRoom = (currentRoom: Room) => {
        floorRenderer.redraw()
        floorRenderer.colorRoom(currentRoom, "rgba(255,123,124,0.73)")
    }

    floorRenderer.onRoomSelection = (room: Room | undefined) => {
        setCurrentRoom(room);
    }
    useEffect(() => {
        if (currentRoom) selectRoom(currentRoom);
    }, [currentRoom])

    const sensorData: SensorData[] = mapSensorDataFromSeries(data.series)
    const mappedByTime: Map<string, Map<string, Map<string, string>>> = sensorData.reduce((map, sensor) => {
        const sensorMap = map.get(sensor.time) ?? new Map();
        const measurementMap: Map<string, string> = sensor.measurements.reduce((measurementMap, measurement) => {
            measurementMap.set(measurement.field, measurement.value);
            return measurementMap;
        }, new Map<string, string>)
        sensorMap.set(sensor.sensorId, measurementMap);
        map.set(sensor.time, sensorMap);
        return map;
    }, new Map<string, Map<string, Map<string, string>>>);

    let colors = ["green", "orange", "yellow"]
    if (fieldColorMode.getColors) {
        colors = fieldColorMode.getColors(useTheme2());
    } else {
        const color = useTheme2().visualization.getColorByName(fieldColor.fixedColor!)
        colors = [color, colorManipulator.asHexString(colorManipulator.lighten(color, 0.5))];
    }


    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            setCanvasCallback(floorRenderer, node, width, height, options, colors, mappedByTime, roomMetrics)
            if (currentRoom) {
                selectRoom(currentRoom)
            }
        }
    }, [width, height, colors, options, mappedByTime, roomMetrics, floorRenderer])

    clearInterval(interval.id);
    interval.id = setInterval(() => animateQualityTransition(floorRenderer, roomMetrics, interval.id), 100);
    const styles = useStyles2(getStyles);
    return (
        <div style={{position: "relative", display: "flex"}}>
            <canvas className={cx(styles.wrapper, css`width: ${width}px; height: ${height}px;`)} ref={canvasRef}/>
            <RoomDrawer currentRoom={currentRoom} onClose={() => setCurrentRoom(undefined)}/>
        </div>
    );
};

/**
 * Slowly and smoothly recolors rooms to avoid flickering
 * @param floorRenderer
 * @param roomMetrics
 * @param intervalId
 */
function animateQualityTransition(floorRenderer: FloorRenderer, roomMetrics: Map<string, number>, intervalId: number) {
    const rooms = floorRenderer.rooms.filter(room => roomMetrics.get(room.name) && roomMetrics.get(room.name) !== room.quality);
    rooms.forEach(room => {
        const desiredIAQ = roomMetrics.get(room.name);
        if (desiredIAQ) {
            const difference = Math.abs(desiredIAQ - room.quality);
            const add = desiredIAQ > room.quality ? 1 : -1;
            room.quality += (add * Math.min(difference, 1));
        }
    })
    if (rooms.length > 0) floorRenderer.redraw()
    if (rooms.length === 0) {
        console.log(`Fixed rooms ${Date.now()}`)
        clearInterval(intervalId)
    }
}

/**
 * Calculates Indoor Air Quality based on a few parameters.
 * @param co2
 * @param temp
 * @param rh
 * @param voc
 */
function calculateIAQ(co2: number, temp: number, rh: number, voc: number) {
    const co2Index = Math.min(6, Math.round(co2 / 400)) - 1; // 1 - 6
    const vocIndex = Math.min(6, Math.round(voc / 50)) - 1; // 1 - 6
    const best = 0
    const worst = 6
    const aqi = Math.min(Math.max(0, 100.0 - (100 * (co2Index / worst))), 100)
    return aqi ?? 0.0;
}

/**
 * Sets the canvas reference of the [floorRenderer] and sets DPI settings in order to have a crisp visualization.
 * @param floorRenderer
 * @param node
 * @param width
 * @param height
 * @param options
 * @param colors
 * @param mappedByTime
 * @param roomMetrics
 */
function setCanvasCallback(floorRenderer: FloorRenderer, node: HTMLCanvasElement, width: number, height: number, options: SimpleOptions, colors: string[], mappedByTime: Map<string, Map<string, Map<string, string>>>, roomMetrics: Map<string, number>) {
    const previousWidth = parseInt(floorRenderer?.canvas?.style?.width ?? "0");
    const previousHeight = parseInt(floorRenderer?.canvas?.style?.height ?? "0");
    floorRenderer.setCanvasNode(node);
    if (previousWidth !== width || previousHeight !== height) {
        floorRenderer.dpiFix(width, height);
        floorRenderer.canvasOffset = {x: 0, y: 0}

        const points = floorRenderer.rooms.flatMap(room => room.lines.flatMap(line => [line.end, line.start]))
        const leastX = points.reduce((previousValue, point) => {
            const x = point.x;
            return x <= previousValue ? x : previousValue;
        }, 0)
        const mostX = points.reduce((previousValue, point) => {
            const x = point.x;
            return x >= previousValue ? x : previousValue;
        }, 0)
        const leastY = points.reduce((previousValue, point) => {
            const y = point.y;
            return y <= previousValue ? y : previousValue;
        }, 0)
        const mostY = points.reduce((previousValue, point) => {
            const y = point.y;
            return y >= previousValue ? y : previousValue;
        }, 0)
        const transformedMinX = floorRenderer.transformFakeToDrawable({x: leastX, y: 0}).x;
        const transformedMaxX = floorRenderer.transformFakeToDrawable({x: mostX, y: 0}).x;
        const transformedMinY = floorRenderer.transformFakeToDrawable({x: 0, y: leastY}).y;
        const transformedMaxY = floorRenderer.transformFakeToDrawable({x: 0, y: mostY}).y;
        const distanceX = transformedMaxX - transformedMinX
        const distanceY = transformedMinY - transformedMaxY
        const ratioX = width / distanceX;
        const ratioY = height / distanceY;
        const ratio = Math.min(ratioY, ratioX);
        floorRenderer.canvasOffset = {x: -transformedMinX * ratioX, y: -transformedMaxY * ratioY}
        floorRenderer.scale = ratio
        floorRenderer.lineWidth = ratio;
        floorRenderer.pointSize = 20 * ratio;
        floorRenderer.halfPointSize = floorRenderer.pointSize / 2;
    }
    floorRenderer.setColors(colors);
    const roomMap: Map<string, string> = new Map(options?.sensorMappings ? JSON.parse(options.sensorMappings) : [])
    const times = Array.from(mappedByTime.keys()).reverse();
    const latestTime = times[0];
    if (mappedByTime.size > 0) {
        [mappedByTime.get(latestTime)].forEach((sensorMap, time) => {
            sensorMap.forEach((value, key) => {
                const rh = value.get("RH");
                const co2 = value.get("co2");
                const voc_index = value.get("voc_index");
                const temp = value.get("temperature");
                // "RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"
                const roomName = roomMap.get(key);
                const iaq = calculateIAQ(toNumber(co2), toNumber(temp), toNumber(rh), toNumber(voc_index))
                const room = floorRenderer.rooms.find(x => x.name === roomName);
                if (room && roomName) { // TODO: Check if this is a bug...
                    if (!roomMetrics.get(roomName)) {
                        room.quality = iaq;
                    }
                    roomMetrics.set(roomName, iaq);
                }
            });
        })
    }
    floorRenderer.redraw()
}

/**
 * Maps DataFrame[] into usable SensorData[].
 * @param series
 */
export function mapSensorDataFromSeries(series: DataFrame[]) {
    return series.reduce((data, series) => {
        const fields = series.fields;
        const fieldOrderValues = fields.find(x => x.name === "_field")?.values
        const fieldOrder = fieldOrderValues && fieldOrderValues["buffer"];
        if (!fieldOrderValues || !fieldOrder) return data;
        const time = fields[0].labels._time;
        return [...data, ...fields.filter(x => x.name !== "_field").map(sensor => {
            const measurements = sensor.values.map((value, index) => ({field: fieldOrder[index], value: value} as Measurement))
            const sensorData: SensorData = {
                sensorId: sensor.name,
                time: time,
                measurements: measurements
            }
            return sensorData;
        })];
    }, []);
}