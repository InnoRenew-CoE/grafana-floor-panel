import React from "react";
import {Room} from "../@types/Graphics";
import {SimpleOptions} from "../types";
import {StandardEditorProps} from "@grafana/data";
import {Measurement, QueryData, SensorData} from "../@types/QueryData";
import {sample_data} from "./SimplePanel";
import {Select} from "@grafana/ui";

export const RoomSensorPicker: React.FC = ({item, value, onChange, context}: StandardEditorProps<SimpleOptions>) => {
    const json = context.options.json;
    //TODO: Uncomment! console.log(context.data);
    const queryData: QueryData = sample_data;
    const sensorData: SensorData[] = queryData.series.reduce((data, series) => {
        const fields = series.fields;
        const fieldOrder = fields.find(x => x.name === "_field").values;
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
    const data: { rooms: Room[] } = JSON.parse(json as string);
    const roomNames = data.rooms.map(room => room.name);
    const sensorNames = [...new Set(sensorData.map(x => x.sensor_id))].map((id, index) => ({label: id, value: id, key: index}))
    const map: Map<string, string> = new Map(value.sensorMappings ? JSON.parse(value.sensorMappings) : []);

    const update = (room, sensor) => {
        console.log(`${room} set to listen to ${sensor} --- ${value.sensorMappings}`)
        map.set(room, sensor);
        const stringified = JSON.stringify(Array.from(map.entries()))
        onChange({...value, sensorMappings: stringified});
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
                const existingMapping = sensorNames.find(x => map.get(name) === x.label);
                return (<tr>
                    <td style={{padding: "0.5em 0"}}>{name}</td>
                    <td style={{padding: "0.5em 0"}}>
                        <div>
                            <div>{JSON.stringify(existingMapping)}</div>
                            <Select
                                value={existingMapping?.value}
                                onChange={e => (update(name, e.target.value))}
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