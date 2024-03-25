import React from "react";
import {SimpleOptions} from "../types";
import {StandardEditorProps} from "@grafana/data";
import {Select} from "@grafana/ui";
import {SensorData} from "../@types/QueryData";
import {Room} from "../@types/Graphics";
import {mapSensorDataFromSeries} from "./SimplePanel";

export const RoomSensorPicker: React.FC = ({value, onChange, context}: StandardEditorProps<SimpleOptions>) => {
    const optionsJson = context?.options?.json;
    const series = (context?.data ?? []);
    if (!series || !optionsJson || series.length === 0) {
        return <div>No sensors detected yet!</div>
    }
    const sensorData: SensorData[] = mapSensorDataFromSeries(series)
    const data: { rooms: Room[] } = JSON.parse(optionsJson as string);
    const roomNames = data.rooms.map(room => room.name);
    const sensorNames = [...new Set(sensorData.map(x => x.sensorId))].map((id, index) => ({label: id, value: id, key: index}))
    const map: Map<string, string> = new Map(value ? JSON.parse(value as string) : []);

    const update = (room, sensor) => {
        if (!sensor) {
            const [key, value] = Array.from(map.entries()).find(([s, r]) => r === room);
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
                return (<tr>
                    <td style={{padding: "0.5em 0"}}>{name}</td>
                    <td style={{padding: "0.5em 0"}}>
                        <div>
                            <Select
                                value={existingMapping}
                                isClearable={true}
                                onChange={e => update(name, e?.value)}
                                options={sensorNames}>
                            </Select>
                        </div>
                    </td>
                </tr>)
            })}
            </tbody>
        </table>
    </div>
}