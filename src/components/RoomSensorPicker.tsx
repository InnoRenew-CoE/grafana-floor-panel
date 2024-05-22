import React from "react";
import {StandardEditorProps} from "@grafana/data";
import {Select} from "@grafana/ui";
import {SensorData, Series} from "../@types/QueryData";
import {mapData, parseRooms} from "./SimplePanel";

export const RoomSensorPicker = ({value, onChange, context}: StandardEditorProps<string>) => {
    const options = context?.options;
    const series = (context?.data ?? []) as unknown as Series[];
    if (!series || !options.svg || series.length === 0) {
        return <div>No sensors detected yet!</div>
    }
    const roomNames = parseRooms(options.svg);
    const sensorData: SensorData[] = mapData(series)
    const sensorNames = [...new Set(sensorData.map(x => x.id))].map((id, index) => ({label: id, value: id, key: index}))
    const map: Map<string, string> = new Map(value ? JSON.parse(value as string) : []);
    const update = (room: string, sensor: string | undefined) => {
        if (!sensor) {
            const [key, value] = Array.from(map.entries()).find(([s, r]) => r === room) ?? ["-", "-"];
            map.delete(key);
        } else {
            map.set(sensor, room);
        }
        const stringified = JSON.stringify(Array.from(map.entries()))
        onChange(stringified);
    }

    return <div>
        <table style={{width: "100%"}}>
            <thead style={{borderBottom: "1px solid rgba(255,255,255, .3)"}}>
            <tr>
                <th>Room</th>
                <th style={{float: "right"}}>Sensor</th>
            </tr>
            </thead>
            <tbody>
            {roomNames.map(name => {
                const existingMapping = sensorNames.find(x => map.get(x.value) === name) || null;
                return (<tr key={name}>
                    <td style={{padding: "0.5em 0"}}>{name}</td>
                    <td style={{padding: "0.5em 0"}}>
                        <div>
                            <Select
                                value={existingMapping}
                                isClearable={true}
                                onChange={e => update(name, e?.value as string)}
                                options={sensorNames}/>
                        </div>
                    </td>
                </tr>)
            })}
            </tbody>
        </table>
    </div>
}