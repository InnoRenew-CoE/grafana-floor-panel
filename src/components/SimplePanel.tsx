import React, {useCallback, useEffect, useState} from 'react';
import {DataFrame, FieldColorModeId, fieldColorModeRegistry} from '@grafana/data';
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
    const [settings] = useState(() => ({colors: ["green", "orange", "yellow"], recompute: false}))

    const jsonData: { rooms: Room[], objects: CanvasElement[] } = JSON.parse(options["json"]);
    if (JSON.stringify(floorRenderer.rooms) !== JSON.stringify(jsonData.rooms)) {
        floorRenderer.rooms = jsonData.rooms;
        floorRenderer.objects = jsonData.objects;
        settings.recompute = true;
    } else settings.recompute = false;
    floorRenderer.onRoomSelection = (room: Room | undefined) => {
        setCurrentRoom(room);
    }
    useEffect(() => {
        if (currentRoom) {
            floorRenderer.redraw()
            floorRenderer.colorRoom(currentRoom, "rgba(110,139,255,0.78)")
        }
    }, [currentRoom, floorRenderer])

    const x = {
        "state": "Done", "series": [
            {
                "refId": "A",
                "meta": {
                    "typeVersion": [0, 0],
                    "executedQueryString": "site_results = from(bucket: \"iaq\")\n  |> range(start: 2024-05-21T06:31:37.883Z, stop: 2024-05-21T06:36:37.884Z)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"iaq_data\")\n  |> filter(fn: (r) => r[\"building\"] == \"innorenew\")\n\nsensor_ids = site_results \n  |> map(fn: (r) => ({r with _value: string(v:r._value)}))\n  |> keep(columns: [\"_time\", \"_value\", \"_field\", \"sensor_id\"])\n\nmapped_sensors = sensor_ids\n  |> truncateTimeColumn(unit: 1m)\n  |> pivot(rowKey: [\"_time\", \"_field\"], columnKey: [\"sensor_id\"], valueColumn: \"_value\")\n  |> group(columns: [\"_time\"])\n\nmapped_sensors\n"
                },
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": [null, null, null, null, null, null, null, null, null, null],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": [null, null, null, null, null, null, null, null, null, null],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.2089", "11.0168", "415.297", "13.2473", "0", "25.6655", "11218710", "NULL", "409", "409"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["54.6563", "12.0718", "464.1105", "14.5874", "10.5984", "24.3063", "396704", "NULL", "415", "415"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.1952", "10.1814", "431.5279", "11.9719", "0.2304", "24.2689", "4629290", "NULL", "740", "740"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["67.2984", "13.2245", "413.1007", "15.9007", "0.9216", "22.2555", "22370644", "NULL", "475", "475"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:31:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.5158", "12.8111", "423.7047", "15.473", "0.0576", "23.5586", "18190872", "NULL", "519", "519"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            },
            {
                "refId": "A",
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["51.7128", "12.0463", "462.1115", "14.6039", "24.8256", "25.2516", "15965952", "NULL", "759", "759"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["47.3274", "11.6112", "435.6695", "14.0825", "0.2304", "26.1782", "18190864", "NULL", "595", "595"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.2272", "10.9948", "415.1926", "13.2145", "0", "25.6227", "11218760", "NULL", "400", "400"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["54.609", "12.0795", "461.6917", "14.5987", "10.5408", "24.333", "396754", "NULL", "406", "406"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.2425", "10.1826", "431.9185", "11.9729", "0.1728", "24.2529", "4629340", "NULL", "726", "726"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["67.3396", "13.2326", "413.0111", "15.9103", "0.9792", "22.2555", "22370692", "NULL", "489", "489"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:32:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.4593", "12.8089", "422.7986", "15.471", "0.0576", "23.5719", "18190920", "NULL", "518", "518"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            },
            {
                "refId": "A",
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["51.7159", "12.0579", "463.9801", "14.6195", "25.2864", "25.2676", "15966002", "NULL", "755", "755"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["47.3075", "11.6253", "437.0763", "14.1028", "0.1728", "26.2075", "18190912", "NULL", "608", "608"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.2242", "10.9859", "416.2967", "13.2013", "0", "25.6094", "11218810", "NULL", "403", "403"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["54.6654", "12.0629", "462.5604", "14.5751", "10.5408", "24.2902", "396804", "NULL", "426", "426"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.2562", "10.1857", "433.7919", "11.9774", "0.2304", "24.2529", "4629390", "NULL", "735", "735"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["67.3365", "13.2218", "412.6758", "15.8968", "0.9216", "22.2421", "22370744", "NULL", "486", "486"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:33:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.4456", "12.7963", "420.4224", "15.4549", "0.0576", "23.5586", "18190972", "NULL", "526", "526"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            },
            {
                "refId": "A",
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["51.7128", "12.0463", "461.7921", "14.6039", "25.5168", "25.2516", "15966052", "NULL", "751", "751"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["47.3167", "11.6189", "435.6394", "14.0936", "0.2304", "26.1942", "18191012", "NULL", "609", "609"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.1723", "11.0081", "418.2274", "13.2351", "0", "25.6655", "11218860", "NULL", "403", "403"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["54.6746", "12.0649", "461.738", "14.5777", "11.1744", "24.2902", "396854", "NULL", "425", "425"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.305", "10.1887", "434.4722", "11.9813", "0.2304", "24.2395", "4629440", "NULL", "743", "743"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["67.3167", "13.2179", "413.521", "15.8922", "0.9216", "22.2421", "22370792", "NULL", "484", "484"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:34:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.4334", "12.7937", "421.7139", "15.4517", "0.0576", "23.5586", "18191022", "NULL", "521", "521"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            }, {
                "refId": "A",
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["51.6442", "12.0412", "461.7366", "14.598", "25.056", "25.2676", "15966102", "NULL", "764", "764"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["47.2953", "11.6137", "435.9547", "14.0866", "0.2304", "26.1942", "18191064", "NULL", "606", "606"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.1311", "11.0262", "419.9609", "13.2627", "0", "25.7109", "11218910", "NULL", "415", "415"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["54.5922", "12.0576", "459.5851", "14.5692", "10.2528", "24.3063", "396955", "NULL", "439", "439"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.3142", "10.183", "434.9754", "11.9721", "0.2304", "24.2262", "4629540", "NULL", "734", "734"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["67.2938", "13.2033", "415.503", "15.8742", "0.9216", "22.2287", "22370892", "NULL", "481", "481"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:35:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.4364", "12.8041", "420.9641", "15.465", "0.0576", "23.5719", "18191072", "NULL", "517", "517"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            }, {
                "refId": "A",
                "fields": [{
                    "name": "_field",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": ["RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-00",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": ["51.725", "12.0492", "460.999", "14.6075", "24.9984", "25.2516", "15966152", "NULL", "761", "761"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-01",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": ["47.3167", "11.6189", "436.5222", "14.0936", "0.2304", "26.1942", "18191112", "NULL", "605", "605"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-02",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": ["46.1494", "11.0108", "418.8579", "13.2397", "0", "25.6788", "11218961", "NULL", "400", "400"],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-03",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": [null, null, null, null, null, null, null, null, null, null],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-04",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": [null, null, null, null, null, null, null, null, null, null],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-06",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": [null, null, null, null, null, null, null, null, null, null],
                    "entities": {},
                    "state": null
                }, {
                    "name": "ir-07",
                    "type": "string",
                    "typeInfo": {"frame": "string", "nullable": true},
                    "labels": {"_time": "2024-05-21 06:36:00 +0000 UTC"},
                    "config": {},
                    "values": ["60.4547", "12.7885", "421.2397", "15.4447", "0.1152", "23.5452", "18191122", "NULL", "517", "517"],
                    "entities": {},
                    "state": null
                }],
                "length": 10
            }], "annotations": [], "request": {
            "app": "panel-editor",
            "requestId": "Q4923",
            "timezone": "browser",
            "panelId": 41,
            "panelPluginId": "innorenew-iaq-panel",
            "dashboardUID": "Ih6kHTFVz",
            "range": {"from": "2024-05-21T06:31:37.883Z", "to": "2024-05-21T06:36:37.884Z", "raw": {"from": "now-5m", "to": "now"}},
            "timeInfo": "",
            "interval": "200ms",
            "intervalMs": 200,
            "targets": [{
                "datasource": {"type": "influxdb", "uid": "CRKpl2FVk"},
                "query": "site_results = from(bucket: \"iaq\")\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"iaq_data\")\n  |> filter(fn: (r) => r[\"building\"] == \"innorenew\")\n\nsensor_ids = site_results \n  |> map(fn: (r) => ({r with _value: string(v:r._value)}))\n  |> keep(columns: [\"_time\", \"_value\", \"_field\", \"sensor_id\"])\n\nmapped_sensors = sensor_ids\n  |> truncateTimeColumn(unit: 1m)\n  |> pivot(rowKey: [\"_time\", \"_field\"], columnKey: [\"sensor_id\"], valueColumn: \"_value\")\n  |> group(columns: [\"_time\"])\n\nmapped_sensors\n",
                "refId": "A"
            }],
            "maxDataPoints": 1488,
            "scopedVars": {"__interval": {"value": "$__interval"}, "__interval_ms": {"value": "$__interval_ms"}},
            "startTime": 1716273397884,
            "filters": [],
            "endTime": 1716273398025
        }, "timings": {"dataProcessingTime": 1}, "structureRev": 2
    }

    const sensorData: SensorData[] = mapSensorDataFromSeries(data.series)
    console.log("SENSOR DATA:")
    console.log(sensorData);
    const mappedByTime: Map<string, Map<string, Map<string, string>>> = sensorData.reduce((map, sensor) => {
        const sensorMap = map.get(sensor.time) ?? new Map();
        const measurementMap: Map<string, string> = sensor.measurements.reduce((measurementMap, measurement) => {
            measurementMap.set(measurement.field, measurement.value);
            return measurementMap;
        }, new Map<string, string>())
        sensorMap.set(sensor.sensorId, measurementMap);
        map.set(sensor.time, sensorMap);
        return map;
    }, new Map<string, Map<string, Map<string, string>>>());
    let theme = useTheme2()
    if (fieldColorMode.getColors) {
        settings.colors = fieldColorMode.getColors(theme)
    }

    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            setCanvasCallback(floorRenderer, node, width,
                height, options, settings.colors
                , mappedByTime, roomMetrics, settings.recompute)
            if (currentRoom) {
                floorRenderer.redraw()
                floorRenderer.colorRoom(currentRoom, "rgba(110,139,255,0.78)")
            }
            floorRenderer.redraw()
        }
    }, [width, height, settings, options, mappedByTime, roomMetrics, currentRoom, floorRenderer])

    clearInterval(interval.id);
    interval.id = window.setInterval(() => animateQualityTransition(floorRenderer, roomMetrics, interval.id), 100);
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
        console.log(`I did Fixed rooms ${Date.now()}`)
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
 * @param recompute
 */
function setCanvasCallback(floorRenderer: FloorRenderer, node: HTMLCanvasElement, width: number, height: number, options: SimpleOptions, colors: string[], mappedByTime: Map<string, Map<string, Map<string, string>>>, roomMetrics: Map<string, number>, recompute = false) {
    const previousWidth = parseInt(floorRenderer?.canvas?.style?.width ?? "0");
    const previousHeight = parseInt(floorRenderer?.canvas?.style?.height ?? "0");
    floorRenderer.setCanvasNode(node);
    if (recompute || previousWidth !== width || previousHeight !== height) {
        floorRenderer.dpiFix(width, height);
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
        const ratio = Math.min(1, ratioY, ratioX);
        const pointSize = 20 * ratio
        floorRenderer.scale = ratio
        floorRenderer.pointSize = pointSize;
        floorRenderer.halfPointSize = pointSize / 2;
        floorRenderer.lineWidth = ratio;
        floorRenderer.canvasOffset = {x: distanceX * ratioX / 2 || 0, y: distanceY * ratioY / 1.25 || 0}
    }
    floorRenderer.setColors(colors);
    const roomMap: Map<string, string> = new Map(options?.sensorMappings ? JSON.parse(options.sensorMappings) : [])
    const times = Array.from(mappedByTime.keys()).reverse();
    const latestTime = times[0];
    const latestSeries = mappedByTime.get(latestTime);
    if (latestSeries) {
        [latestSeries].forEach((sensorMap, time) => {
            sensorMap.forEach((value, key) => {
                const rh = value.get("RH");
                const co2 = value.get("co2");
                const voc_index = value.get("voc_index");
                const temp = value.get("temperature");
                // "RH", "abs_humidity", "co2", "dew_point", "luminance", "temperature", "turned_on", "voc_acc", "voc_eq_co2", "voc_index"
                const roomName = roomMap.get(key);
                console.log(`Calculating iaq for room ${roomName} with sensor ${key}`)
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
}

/**
 * Maps DataFrame[] into usable SensorData[].
 * @param series
 */
export function mapSensorDataFromSeries(series: DataFrame[]): SensorData[] {
    return series.reduce((data, series) => {
        const fields = series.fields;
        const fieldOrderValues = fields.find(x => x.name === "_field")?.values
        console.log(fieldOrderValues)
        if (!fieldOrderValues) return data;
        // const fieldOrder: string[] | undefined = fieldOrderValues["buffer"];
        // console.log(fieldOrderValues)
        // if (!fieldOrder) return data;
        const time = fields[0]?.labels?._time ?? "Now";
        return [...data, ...fields.filter(x => x.name !== "_field").map(sensor => {
            const measurements = sensor.values.map((value, index) => ({field: fieldOrderValues[index], value: value} as Measurement))
            const sensorData: SensorData = {
                sensorId: sensor.name,
                time: time,
                measurements: measurements
            }
            console.log(sensorData)
            return sensorData;
        })];
    }, [] as SensorData[]);
}