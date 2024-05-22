import React, {useCallback, useState} from 'react';
import {FieldColorModeId, fieldColorModeRegistry} from '@grafana/data';
import {useTheme2} from '@grafana/ui';
import {Props} from "../@types/PanelProps";
import {SensorData, Series} from "../@types/QueryData";
import {Room} from "../@types/Graphics";
import Rainbow from "rainbowvis.js";
import {now, random} from "lodash";

export const SimplePanel: React.FC<Props> = ({options, data, width, height, fieldConfig}) => {
    const fieldColor = fieldConfig.defaults.color || {mode: FieldColorModeId.ContinuousGrYlRd};
    const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);
    const [roomMetrics] = useState(() => new Map<string, number>());
    const [rooms, setRooms] = useState<Room[]>(() => []);
    const [interval] = useState({id: 0});
    const [rainbow] = useState(() => new Rainbow());
    const [container, setContainer] = useState<HTMLElement | undefined>(undefined);
    const [settings] = useState(() => ({colors: ["green", "orange", "yellow"], recompute: false}))
    const [lastUpdate, setLastUpdate] = useState<number>(0);

    let theme = useTheme2()
    if (fieldColorMode.getColors) {
        settings.colors = fieldColorMode.getColors(theme)
    }
    if (now() - lastUpdate > 3000) {
        setLastUpdate(now())
        const measurements: SensorData[] = mapData(data.series as unknown as Series[]);
        const sensorMappings: Map<string, string> = new Map(options.sensorMappings ? JSON.parse(options.sensorMappings) : []);
        for (let sensorData of measurements) {
            const room = sensorMappings.get(sensorData.id);
            if (!room) continue;
            const values = sensorData.values;
            const iaq = calculateIAQ(values.get("co2"), values.get("temperature"), 0, 0) + random(-50, 50, false);
            roomMetrics.set(room, iaq)
        }
    }

    clearInterval(interval.id);
    if (container) {
        interval.id = window.setInterval(() => animateQualityTransition(rainbow, container, rooms, roomMetrics, interval.id), 50);
    }
    const svgRef = useCallback((node) => {
        if (node instanceof HTMLElement) {
            console.log("REF")
            node.innerHTML = options.svg;
            rainbow.setSpectrumByArray(settings.colors)
            const all: Room[] = parseRooms(options.svg).map(name => ({name: name, quality: 0}));
            setRooms(all)
            setContainer(node)
            const svg = node.getElementsByTagName("svg")[0];
            if (svg) {
                svg.removeAttribute("width");
                svg.removeAttribute("height");
            }
        }
    }, [options])
    return (
        <div ref={svgRef} style={{overflow: "hidden", width: width, height: height, display: "flex", alignItems: "stretch", justifyContent: "center"}}>
        </div>
    );
};

export function mapData(series: Series[]) {
    return series.map(s => {
        const time = s.fields.find(x => x.name === "_time")?.values?.get(0) as number ?? Date.now();
        const fieldOrder = s.fields.find(x => x.name === "_field");
        if (!fieldOrder) return null;
        const fields = fieldOrder.values;
        const sensorId = fieldOrder.labels.sensor_id;
        const fieldValues = s.fields.find(x => x.name === "_value")?.values ?? [];
        const valueMap = new Map<string, number>();
        for (let i = 0; i < fields.length; i++) {
            valueMap.set(fields[i], parseFloat(fieldValues[i]));
        }
        return {id: sensorId, values: valueMap, time: time} as SensorData
    }).filter(x => x) as SensorData[];
}

/**
 * Slowly and smoothly recolors rooms to avoid flickering
 * @param rainbow
 * @param container
 * @param rooms
 * @param roomMetrics
 * @param intervalId
 */
function animateQualityTransition(rainbow: Rainbow, container: HTMLElement, rooms: Room[], roomMetrics: Map<string, number>, intervalId: number) {
    const redrawNeeded = rooms.filter(room => {
        const metric = roomMetrics.get(room.name);
        if (!metric) return false;
        return metric !== room.quality;
    });
    redrawNeeded.forEach(room => {
        const desiredIAQ = roomMetrics.get(room.name);
        if (desiredIAQ) {
            const difference = Math.abs(desiredIAQ - room.quality);
            const add = desiredIAQ > room.quality ? 1 : -1;
            room.quality += (add * Math.min(difference, 1));
            const roomElement = container.querySelector(`#room\\:${room.name}`);
            if (roomElement) {
                roomElement.setAttribute("fill", `#${rainbow.colorAt(room.quality)}`)
            }
        }
    })
    if (redrawNeeded.length === 0) {
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
    return aqi ?? 0.0;
}

export function parseRooms(svg: string) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(svg, "image/svg+xml");
    const rooms = parsed.querySelectorAll('[id*="room"]')
    const roomNames: string[] = ([...rooms].map(x => x.id.replaceAll(/room:/g, "")))
    return roomNames;
}