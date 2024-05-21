import React, {useCallback, useState} from 'react';
import {FieldColorModeId, fieldColorModeRegistry} from '@grafana/data';
import {css, cx} from '@emotion/css';
import {useStyles2, useTheme2} from '@grafana/ui';
import {Room} from "../@types/Graphics";
import {Props} from "../@types/PanelProps";
import {getStyles} from "./PanelStyle";
import {RoomDrawer} from "./RoomDrawer";
import {Renderer} from "./Renderer";
import Clean from "img/clean.svg"
import {Series} from "../@types/QueryData";

export const SimplePanel: React.FC<Props> = ({options, data, width, height, fieldConfig}) => {
    const fieldColor = fieldConfig.defaults.color || {mode: FieldColorModeId.ContinuousGrYlRd};
    const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);
    const [roomMetrics] = useState(() => new Map<string, number>());
    const [interval] = useState({id: 0});
    const [renderer] = useState(() => new Renderer());
    const [currentRoom, setCurrentRoom] = useState(() => undefined as (Room | undefined))
    const [settings] = useState(() => ({colors: ["green", "orange", "yellow"], recompute: false}))

    const jsonData: Room[] = JSON.parse(options["json"]);
    if (JSON.stringify(renderer.rooms) !== JSON.stringify(jsonData)) {
        renderer.setRooms(jsonData)
        settings.recompute = true;
    } else settings.recompute = false;
    mapData(data.series);
    let theme = useTheme2()
    if (fieldColorMode.getColors) {
        settings.colors = fieldColorMode.getColors(theme)
    }
    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            renderer.setup(node, "img/clean.svg", width, height);
            renderer.redraw()
        }
    }, [width, height, settings, options, roomMetrics, currentRoom, renderer])

    clearInterval(interval.id);
    interval.id = window.setInterval(() => animateQualityTransition(renderer, roomMetrics, interval.id), 100);
    const styles = useStyles2(getStyles);
    console.log(Clean)
    return (
        <div style={{position: "relative", display: "flex"}}>
            <canvas className={cx(styles.wrapper, css`width: ${width}px; height: ${height}px;`)} ref={canvasRef}/>
            <RoomDrawer currentRoom={currentRoom} onClose={() => setCurrentRoom(undefined)}/>
        </div>
    );
};

function mapData(series: Series[]) {
    series.forEach(s => {
        const fieldOrder = s.fields.find(x => x.name === "_field");
        const fields = fieldOrder.values;
        const sensorId = fieldOrder.labels.sensor_id;
        const fieldValues = s.fields.find(x => x.name === "_value").values;
        console.log(`Sensor: ${sensorId} => ${fieldValues}`)
        // TODO: Make so we can keep history of two time events.
        // TODO: Store in <ID, <<Field, Value>>>
    })
}

/**
 * Slowly and smoothly recolors rooms to avoid flickering
 * @param floorRenderer
 * @param roomMetrics
 * @param intervalId
 */
function animateQualityTransition(floorRenderer: Renderer, roomMetrics: Map<string, number>, intervalId: number) {
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
    const co2Index = Math.min(6, Math.round(co2 / 400)); // 1 - 6
    const vocIndex = Math.min(6, Math.round(voc / 50)); // 1 - 6
    const best = 0
    const worst = 6
    const aqi = Math.min(Math.max(0, 100.0 - (100 * (co2Index / worst))), 100)
    console.log(`${co2} ${co2Index} ${worst} => ${co2 / 400} ${co2Index / worst} ${aqi}`)
    return aqi ?? 0.0;
}