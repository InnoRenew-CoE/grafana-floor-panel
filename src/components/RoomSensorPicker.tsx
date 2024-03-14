import React from "react";
import {SimpleOptions} from "../types";
import {StandardEditorProps} from "@grafana/data";
import {Select} from "@grafana/ui";
import {Measurement, SensorData, Series} from "../@types/QueryData";
import {Room} from "../@types/Graphics";

export const RoomSensorPicker: React.FC = ({item, value, onChange, context}: StandardEditorProps<SimpleOptions>) => {
    const optionsJson = context?.options?.json;
    const series = (context?.data ?? []) as Series[];
    console.log(series);
    if (!series || !optionsJson || series.length === 0) {
        return <div>No sensors detected yet!</div>
    }
    const sensorData: SensorData[] = series.reduce((data, series) => {
        const fields = series.fields;
        const fieldOrder = fields.find(x => x.name === "_field")?.values;
        if (!fieldOrder) {
            return data
        }
        const time = fields[0].labels._time;
        return [...data, ...fields.filter(x => x.name !== "_field").map(sensor => {
            const measurements = sensor.values.map((value, index) => ({field: fieldOrder[index], value: value} as Measurement))
            const sensorData: SensorData = {
                sensor_id: sensor.name,
                time: time,
                measurements: measurements
            }
            return sensorData;
        })];
    }, []);
    const data: { rooms: Room[] } = JSON.parse(optionsJson as string);
    const roomNames = data.rooms.map(room => room.name);
    const sensorNames = [...new Set(sensorData.map(x => x.sensor_id))].map((id, index) => ({label: id, value: id, key: index}))
    const map: Map<string, string> = new Map(value ? JSON.parse(value as string) : []);

    const update = (room, sensor) => {
        console.log(`${room} set to listen to ${sensor}`)
        if (!sensor) {
            const [key, value] = Array.from(map.entries()).find(([s, r]) => r === room);
            console.log(`Found ${key} ${value}`)
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
                console.log(existingMapping);
                console.log(sensorNames);
                console.log(map);
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