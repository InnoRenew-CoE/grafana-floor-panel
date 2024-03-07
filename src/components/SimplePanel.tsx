import React, {useCallback} from 'react';
import {colorManipulator, FieldColorModeId, fieldColorModeRegistry, PanelProps} from '@grafana/data';
import {SimpleOptions} from 'types';
import {css, cx} from '@emotion/css';
import {useStyles2, useTheme2} from '@grafana/ui';
import {FloorRenderer} from "./FloorRender";
import {CanvasElement, Room} from "../@types/Graphics";
import {Measurement, QueryData, SensorData} from "../@types/QueryData";

export const sample_data: QueryData = JSON.parse<QueryData>(`{
  "state": "Done",
  "series": [
    {
      "refId": "A",
      "meta": {
        "executedQueryString": "site_results = from(bucket: \\"iaq\\")\\n  |> range(start: 2024-03-06T09:37:09.252Z, stop: 2024-03-06T09:42:09.252Z)\\n  |> filter(fn: (r) => r[\\"_measurement\\"] == \\"iaq_data\\")\\n  |> filter(fn: (r) => r[\\"building\\"] == \\"innorenew\\")\\n\\nsensor_ids = site_results \\n  |> map(fn: (r) => ({r with _value : string(v: r._value)}))\\n  |> keep(columns: [\\"_time\\", \\"_value\\", \\"_field\\", \\"sensor_id\\"])\\n  |> group(columns: [\\"sensor_id\\"])\\n\\nmapped_sensors = sensor_ids \\n  |> truncateTimeColumn(unit: 1m)\\n  |> group(columns: [\\"_time\\", \\"sensor_id\\"])\\n  |> pivot(rowKey: [\\"_time\\", \\"_field\\"], columnKey: [\\"sensor_id\\"], valueColumn: \\"_value\\")\\n\\n\\n\\nmapped_sensors"
      },
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3757",
            "10.8551",
            "623.9413",
            "12.9653",
            "462.816",
            "24.5866",
            "9410652",
            "NULL",
            "629",
            "629"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0372",
            "8.802",
            "484.644",
            "9.7996",
            "29.2608",
            "24.6721",
            "11635598",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2889",
            "8.6175",
            "517.8588",
            "9.4593",
            "60.8832",
            "24.1834",
            "4663480",
            "NULL",
            "620",
            "620"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.8264",
            "8.3996",
            "439.2717",
            "8.9403",
            "43.3152",
            "21.4303",
            "11635574",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "41.2741",
            "9.4275",
            "695.0144",
            "10.8406",
            "98.784",
            "24.9017",
            "30298932",
            "NULL",
            "476",
            "476"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "53.0999",
            "8.6002",
            "437.1109",
            "9.1645",
            "50.5728",
            "18.9336",
            "7061178",
            "NULL",
            "421",
            "421"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.6683",
            "8.4646",
            "422.3865",
            "9.0843",
            "150.1632",
            "22.0178",
            "15815400",
            "NULL",
            "469",
            "469"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3162",
            "10.8418",
            "624.4897",
            "12.9464",
            "464.256",
            "24.5866",
            "9410702",
            "NULL",
            "632",
            "632"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0326",
            "8.7797",
            "487.499",
            "9.7597",
            "28.9152",
            "24.6294",
            "11635648",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2615",
            "8.6115",
            "521.9091",
            "9.4489",
            "60.8832",
            "24.1834",
            "4663530",
            "NULL",
            "622",
            "622"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.6754",
            "8.3648",
            "444.9577",
            "8.8782",
            "43.1424",
            "21.417",
            "11635624",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.7248",
            "9.4215",
            "702.7783",
            "10.8425",
            "117.6192",
            "25.1287",
            "30299032",
            "NULL",
            "402",
            "402"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.8298",
            "8.535",
            "435.2854",
            "9.0491",
            "50.4",
            "18.8908",
            "7061278",
            "NULL",
            "418",
            "418"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.6683",
            "8.4646",
            "424.9971",
            "9.0843",
            "150.048",
            "22.0178",
            "15815450",
            "NULL",
            "473",
            "473"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3162",
            "10.8418",
            "633.1143",
            "12.9464",
            "472.4928",
            "24.5866",
            "9410802",
            "NULL",
            "638",
            "638"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0463",
            "8.7894",
            "489.5795",
            "9.7769",
            "28.8576",
            "24.6427",
            "11635698",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2386",
            "8.6143",
            "523.5457",
            "9.4545",
            "60.8256",
            "24.1995",
            "4663580",
            "NULL",
            "623",
            "623"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.7395",
            "8.404",
            "447.253",
            "8.9503",
            "44.928",
            "21.473",
            "11635724",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.5432",
            "9.4176",
            "709.8577",
            "10.8398",
            "124.1856",
            "25.2008",
            "30299084",
            "NULL",
            "413",
            "413"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.7611",
            "8.5172",
            "434.3261",
            "9.0175",
            "50.4576",
            "18.8775",
            "7061328",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.5355",
            "8.4453",
            "425.5932",
            "9.0512",
            "149.9904",
            "22.0311",
            "15815500",
            "NULL",
            "472",
            "472"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.2841",
            "10.8542",
            "634.1667",
            "12.9656",
            "479.808",
            "24.6187",
            "9410852",
            "NULL",
            "631",
            "631"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.06",
            "8.7992",
            "489.7692",
            "9.794",
            "28.9152",
            "24.6561",
            "11635748",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1653",
            "8.6177",
            "521.9247",
            "9.4625",
            "60.8832",
            "24.2395",
            "4663631",
            "NULL",
            "626",
            "626"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.5563",
            "8.3761",
            "447.5344",
            "8.9016",
            "45.8496",
            "21.4864",
            "11635774",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.6149",
            "9.4498",
            "717.3676",
            "10.8927",
            "124.128",
            "25.2302",
            "30299132",
            "NULL",
            "437",
            "437"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.6497",
            "8.4992",
            "434.2972",
            "8.9861",
            "50.4",
            "18.8775",
            "7061378",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.5233",
            "8.4495",
            "424.9836",
            "9.0591",
            "149.9328",
            "22.0445",
            "15815550",
            "NULL",
            "463",
            "463"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3833",
            "10.8929",
            "636.9828",
            "13.0215",
            "476.5824",
            "24.6454",
            "9410902",
            "NULL",
            "631",
            "631"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1196",
            "8.7993",
            "488.4653",
            "9.7929",
            "29.088",
            "24.6294",
            "11635848",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1791",
            "8.6208",
            "522.9129",
            "9.4677",
            "60.9408",
            "24.2395",
            "4663731",
            "NULL",
            "629",
            "629"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.5579",
            "8.3828",
            "445.4211",
            "8.9142",
            "45.5616",
            "21.4997",
            "11635824",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.5066",
            "9.4246",
            "728.5778",
            "10.8525",
            "123.2064",
            "25.2302",
            "30299184",
            "NULL",
            "447",
            "447"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.6055",
            "8.492",
            "433.3995",
            "8.9736",
            "50.112",
            "18.8775",
            "7061429",
            "NULL",
            "430",
            "430"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.4043",
            "8.4263",
            "425.3528",
            "9.0185",
            "150.048",
            "22.0445",
            "15815650",
            "NULL",
            "463",
            "463"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    }
  ],
  "annotations": [],
  "request": {
    "app": "explore",
    "dashboardId": 0,
    "timezone": "browser",
    "startTime": 1709718129274,
    "interval": "200ms",
    "intervalMs": 200,
    "panelId": "Q-4155bce8-d4aa-4458-a328-bbd77f6672d7-0",
    "targets": [
      {
        "refId": "A",
        "datasource": {
          "type": "influxdb",
          "uid": "CRKpl2FVk"
        },
        "query": "site_results = from(bucket: \\"iaq\\")\\n  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)\\n  |> filter(fn: (r) => r[\\"_measurement\\"] == \\"iaq_data\\")\\n  |> filter(fn: (r) => r[\\"building\\"] == \\"innorenew\\")\\n\\nsensor_ids = site_results \\n  |> map(fn: (r) => ({r with _value : string(v: r._value)}))\\n  |> keep(columns: [\\"_time\\", \\"_value\\", \\"_field\\", \\"sensor_id\\"])\\n  |> group(columns: [\\"sensor_id\\"])\\n\\nmapped_sensors = sensor_ids \\n  |> truncateTimeColumn(unit: 1m)\\n  |> group(columns: [\\"_time\\", \\"sensor_id\\"])\\n  |> pivot(rowKey: [\\"_time\\", \\"_field\\"], columnKey: [\\"sensor_id\\"], valueColumn: \\"_value\\")\\n\\n\\n\\nmapped_sensors",
        "key": "Q-4155bce8-d4aa-4458-a328-bbd77f6672d7-0"
      }
    ],
    "range": {
      "from": "2024-03-06T09:37:09.252Z",
      "to": "2024-03-06T09:42:09.252Z",
      "raw": {
        "from": "now-5m",
        "to": "now"
      }
    },
    "requestId": "explore_left",
    "rangeRaw": {
      "from": "now-5m",
      "to": "now"
    },
    "scopedVars": {
      "__interval": {
        "text": "200ms",
        "value": "200ms"
      },
      "__interval_ms": {
        "text": 200,
        "value": 200
      }
    },
    "maxDataPoints": 1863,
    "liveStreaming": false,
    "endTime": 1709718129375
  },
  "timeRange": {
    "from": "2024-03-06T09:37:09.252Z",
    "to": "2024-03-06T09:42:09.252Z",
    "raw": {
      "from": "now-5m",
      "to": "now"
    }
  },
  "timings": {
    "dataProcessingTime": 0
  },
  "graphFrames": [],
  "tableFrames": [
    {
      "refId": "A",
      "meta": {
        "executedQueryString": "site_results = from(bucket: \\"iaq\\")\\n  |> range(start: 2024-03-06T09:37:09.252Z, stop: 2024-03-06T09:42:09.252Z)\\n  |> filter(fn: (r) => r[\\"_measurement\\"] == \\"iaq_data\\")\\n  |> filter(fn: (r) => r[\\"building\\"] == \\"innorenew\\")\\n\\nsensor_ids = site_results \\n  |> map(fn: (r) => ({r with _value : string(v: r._value)}))\\n  |> keep(columns: [\\"_time\\", \\"_value\\", \\"_field\\", \\"sensor_id\\"])\\n  |> group(columns: [\\"sensor_id\\"])\\n\\nmapped_sensors = sensor_ids \\n  |> truncateTimeColumn(unit: 1m)\\n  |> group(columns: [\\"_time\\", \\"sensor_id\\"])\\n  |> pivot(rowKey: [\\"_time\\", \\"_field\\"], columnKey: [\\"sensor_id\\"], valueColumn: \\"_value\\")\\n\\n\\n\\nmapped_sensors"
      },
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3757",
            "10.8551",
            "623.9413",
            "12.9653",
            "462.816",
            "24.5866",
            "9410652",
            "NULL",
            "629",
            "629"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0372",
            "8.802",
            "484.644",
            "9.7996",
            "29.2608",
            "24.6721",
            "11635598",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2889",
            "8.6175",
            "517.8588",
            "9.4593",
            "60.8832",
            "24.1834",
            "4663480",
            "NULL",
            "620",
            "620"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.8264",
            "8.3996",
            "439.2717",
            "8.9403",
            "43.3152",
            "21.4303",
            "11635574",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "41.2741",
            "9.4275",
            "695.0144",
            "10.8406",
            "98.784",
            "24.9017",
            "30298932",
            "NULL",
            "476",
            "476"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "53.0999",
            "8.6002",
            "437.1109",
            "9.1645",
            "50.5728",
            "18.9336",
            "7061178",
            "NULL",
            "421",
            "421"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:37:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.6683",
            "8.4646",
            "422.3865",
            "9.0843",
            "150.1632",
            "22.0178",
            "15815400",
            "NULL",
            "469",
            "469"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:37:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3162",
            "10.8418",
            "624.4897",
            "12.9464",
            "464.256",
            "24.5866",
            "9410702",
            "NULL",
            "632",
            "632"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0326",
            "8.7797",
            "487.499",
            "9.7597",
            "28.9152",
            "24.6294",
            "11635648",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2615",
            "8.6115",
            "521.9091",
            "9.4489",
            "60.8832",
            "24.1834",
            "4663530",
            "NULL",
            "622",
            "622"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.6754",
            "8.3648",
            "444.9577",
            "8.8782",
            "43.1424",
            "21.417",
            "11635624",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.7248",
            "9.4215",
            "702.7783",
            "10.8425",
            "117.6192",
            "25.1287",
            "30299032",
            "NULL",
            "402",
            "402"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.8298",
            "8.535",
            "435.2854",
            "9.0491",
            "50.4",
            "18.8908",
            "7061278",
            "NULL",
            "418",
            "418"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:38:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.6683",
            "8.4646",
            "424.9971",
            "9.0843",
            "150.048",
            "22.0178",
            "15815450",
            "NULL",
            "473",
            "473"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:38:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3162",
            "10.8418",
            "633.1143",
            "12.9464",
            "472.4928",
            "24.5866",
            "9410802",
            "NULL",
            "638",
            "638"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.0463",
            "8.7894",
            "489.5795",
            "9.7769",
            "28.8576",
            "24.6427",
            "11635698",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.2386",
            "8.6143",
            "523.5457",
            "9.4545",
            "60.8256",
            "24.1995",
            "4663580",
            "NULL",
            "623",
            "623"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.7395",
            "8.404",
            "447.253",
            "8.9503",
            "44.928",
            "21.473",
            "11635724",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.5432",
            "9.4176",
            "709.8577",
            "10.8398",
            "124.1856",
            "25.2008",
            "30299084",
            "NULL",
            "413",
            "413"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.7611",
            "8.5172",
            "434.3261",
            "9.0175",
            "50.4576",
            "18.8775",
            "7061328",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:39:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.5355",
            "8.4453",
            "425.5932",
            "9.0512",
            "149.9904",
            "22.0311",
            "15815500",
            "NULL",
            "472",
            "472"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:39:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.2841",
            "10.8542",
            "634.1667",
            "12.9656",
            "479.808",
            "24.6187",
            "9410852",
            "NULL",
            "631",
            "631"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.06",
            "8.7992",
            "489.7692",
            "9.794",
            "28.9152",
            "24.6561",
            "11635748",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1653",
            "8.6177",
            "521.9247",
            "9.4625",
            "60.8832",
            "24.2395",
            "4663631",
            "NULL",
            "626",
            "626"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.5563",
            "8.3761",
            "447.5344",
            "8.9016",
            "45.8496",
            "21.4864",
            "11635774",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.6149",
            "9.4498",
            "717.3676",
            "10.8927",
            "124.128",
            "25.2302",
            "30299132",
            "NULL",
            "437",
            "437"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.6497",
            "8.4992",
            "434.2972",
            "8.9861",
            "50.4",
            "18.8775",
            "7061378",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:40:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.5233",
            "8.4495",
            "424.9836",
            "9.0591",
            "149.9328",
            "22.0445",
            "15815550",
            "NULL",
            "463",
            "463"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:40:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    },
    {
      "refId": "A",
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index"
          ],
          "entities": {},
          "state": {
            "displayName": "_field 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-00",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "48.3833",
            "10.8929",
            "636.9828",
            "13.0215",
            "476.5824",
            "24.6454",
            "9410902",
            "NULL",
            "631",
            "631"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-00 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-01",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1196",
            "8.7993",
            "488.4653",
            "9.7929",
            "29.088",
            "24.6294",
            "11635848",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-01 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-02",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "39.1791",
            "8.6208",
            "522.9129",
            "9.4677",
            "60.9408",
            "24.2395",
            "4663731",
            "NULL",
            "629",
            "629"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-02 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-03",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "44.5579",
            "8.3828",
            "445.4211",
            "8.9142",
            "45.5616",
            "21.4997",
            "11635824",
            "NULL",
            "400",
            "400"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-03 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-04",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "40.5066",
            "9.4246",
            "728.5778",
            "10.8525",
            "123.2064",
            "25.2302",
            "30299184",
            "NULL",
            "447",
            "447"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-04 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-05",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "52.6055",
            "8.492",
            "433.3995",
            "8.9736",
            "50.112",
            "18.8775",
            "7061429",
            "NULL",
            "430",
            "430"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-05 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        },
        {
          "name": "ir-06",
          "type": "string",
          "typeInfo": {
            "frame": "string",
            "nullable": true
          },
          "labels": {
            "_time": "2024-03-06 09:41:00 +0000 UTC"
          },
          "config": {},
          "values": [
            "43.4043",
            "8.4263",
            "425.3528",
            "9.0185",
            "150.048",
            "22.0445",
            "15815650",
            "NULL",
            "463",
            "463"
          ],
          "entities": {},
          "state": {
            "displayName": "ir-06 2024-03-06 09:41:00 +0000 UTC",
            "multipleFrames": false
          }
        }
      ],
      "length": 10
    }
  ],
  "logsFrames": [],
  "traceFrames": [],
  "nodeGraphFrames": [],
  "flameGraphFrames": [],
  "graphResult": null,
  "tableResult": [
    {
      "fields": [
        {
          "name": "_field",
          "type": "string",
          "config": {},
          "values": [
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_acc",
            "voc_eq_co2",
            "voc_index",
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_eq_co2",
            "voc_index",
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_eq_co2",
            "voc_index",
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_eq_co2",
            "voc_index",
            "RH",
            "abs_humidity",
            "co2",
            "dew_point",
            "luminance",
            "temperature",
            "turned_on",
            "voc_eq_co2",
            "voc_index"
          ]
        },
        {
          "name": "ir-00",
          "type": "string",
          "config": {},
          "values": [
            "48.3757",
            "10.8551",
            "623.9413",
            "12.9653",
            "462.816",
            "24.5866",
            "9410652",
            "NULL",
            "629",
            "629",
            "48.3162",
            "10.8418",
            "624.4897",
            "12.9464",
            "464.256",
            "24.5866",
            "9410702",
            "632",
            "632",
            "48.3162",
            "10.8418",
            "633.1143",
            "12.9464",
            "472.4928",
            "24.5866",
            "9410802",
            "638",
            "638",
            "48.2841",
            "10.8542",
            "634.1667",
            "12.9656",
            "479.808",
            "24.6187",
            "9410852",
            "631",
            "631",
            "48.3833",
            "10.8929",
            "636.9828",
            "13.0215",
            "476.5824",
            "24.6454",
            "9410902",
            "631",
            "631"
          ]
        },
        {
          "name": "ir-01",
          "type": "string",
          "config": {},
          "values": [
            "39.0372",
            "8.802",
            "484.644",
            "9.7996",
            "29.2608",
            "24.6721",
            "11635598",
            "NULL",
            "400",
            "400",
            "39.0326",
            "8.7797",
            "487.499",
            "9.7597",
            "28.9152",
            "24.6294",
            "11635648",
            "400",
            "400",
            "39.0463",
            "8.7894",
            "489.5795",
            "9.7769",
            "28.8576",
            "24.6427",
            "11635698",
            "400",
            "400",
            "39.06",
            "8.7992",
            "489.7692",
            "9.794",
            "28.9152",
            "24.6561",
            "11635748",
            "400",
            "400",
            "39.1196",
            "8.7993",
            "488.4653",
            "9.7929",
            "29.088",
            "24.6294",
            "11635848",
            "400",
            "400"
          ]
        },
        {
          "name": "ir-02",
          "type": "string",
          "config": {},
          "values": [
            "39.2889",
            "8.6175",
            "517.8588",
            "9.4593",
            "60.8832",
            "24.1834",
            "4663480",
            "NULL",
            "620",
            "620",
            "39.2615",
            "8.6115",
            "521.9091",
            "9.4489",
            "60.8832",
            "24.1834",
            "4663530",
            "622",
            "622",
            "39.2386",
            "8.6143",
            "523.5457",
            "9.4545",
            "60.8256",
            "24.1995",
            "4663580",
            "623",
            "623",
            "39.1653",
            "8.6177",
            "521.9247",
            "9.4625",
            "60.8832",
            "24.2395",
            "4663631",
            "626",
            "626",
            "39.1791",
            "8.6208",
            "522.9129",
            "9.4677",
            "60.9408",
            "24.2395",
            "4663731",
            "629",
            "629"
          ]
        },
        {
          "name": "ir-03",
          "type": "string",
          "config": {},
          "values": [
            "44.8264",
            "8.3996",
            "439.2717",
            "8.9403",
            "43.3152",
            "21.4303",
            "11635574",
            "NULL",
            "400",
            "400",
            "44.6754",
            "8.3648",
            "444.9577",
            "8.8782",
            "43.1424",
            "21.417",
            "11635624",
            "400",
            "400",
            "44.7395",
            "8.404",
            "447.253",
            "8.9503",
            "44.928",
            "21.473",
            "11635724",
            "400",
            "400",
            "44.5563",
            "8.3761",
            "447.5344",
            "8.9016",
            "45.8496",
            "21.4864",
            "11635774",
            "400",
            "400",
            "44.5579",
            "8.3828",
            "445.4211",
            "8.9142",
            "45.5616",
            "21.4997",
            "11635824",
            "400",
            "400"
          ]
        },
        {
          "name": "ir-04",
          "type": "string",
          "config": {},
          "values": [
            "41.2741",
            "9.4275",
            "695.0144",
            "10.8406",
            "98.784",
            "24.9017",
            "30298932",
            "NULL",
            "476",
            "476",
            "40.7248",
            "9.4215",
            "702.7783",
            "10.8425",
            "117.6192",
            "25.1287",
            "30299032",
            "402",
            "402",
            "40.5432",
            "9.4176",
            "709.8577",
            "10.8398",
            "124.1856",
            "25.2008",
            "30299084",
            "413",
            "413",
            "40.6149",
            "9.4498",
            "717.3676",
            "10.8927",
            "124.128",
            "25.2302",
            "30299132",
            "437",
            "437",
            "40.5066",
            "9.4246",
            "728.5778",
            "10.8525",
            "123.2064",
            "25.2302",
            "30299184",
            "447",
            "447"
          ]
        },
        {
          "name": "ir-05",
          "type": "string",
          "config": {},
          "values": [
            "53.0999",
            "8.6002",
            "437.1109",
            "9.1645",
            "50.5728",
            "18.9336",
            "7061178",
            "NULL",
            "421",
            "421",
            "52.8298",
            "8.535",
            "435.2854",
            "9.0491",
            "50.4",
            "18.8908",
            "7061278",
            "418",
            "418",
            "52.7611",
            "8.5172",
            "434.3261",
            "9.0175",
            "50.4576",
            "18.8775",
            "7061328",
            "400",
            "400",
            "52.6497",
            "8.4992",
            "434.2972",
            "8.9861",
            "50.4",
            "18.8775",
            "7061378",
            "400",
            "400",
            "52.6055",
            "8.492",
            "433.3995",
            "8.9736",
            "50.112",
            "18.8775",
            "7061429",
            "430",
            "430"
          ]
        },
        {
          "name": "ir-06",
          "type": "string",
          "config": {},
          "values": [
            "43.6683",
            "8.4646",
            "422.3865",
            "9.0843",
            "150.1632",
            "22.0178",
            "15815400",
            "NULL",
            "469",
            "469",
            "43.6683",
            "8.4646",
            "424.9971",
            "9.0843",
            "150.048",
            "22.0178",
            "15815450",
            "473",
            "473",
            "43.5355",
            "8.4453",
            "425.5932",
            "9.0512",
            "149.9904",
            "22.0311",
            "15815500",
            "472",
            "472",
            "43.5233",
            "8.4495",
            "424.9836",
            "9.0591",
            "149.9328",
            "22.0445",
            "15815550",
            "463",
            "463",
            "43.4043",
            "8.4263",
            "425.3528",
            "9.0185",
            "150.048",
            "22.0445",
            "15815650",
            "463",
            "463"
          ]
        }
      ]
    }
  ],
  "logsResult": null
}`)

export interface Props extends PanelProps<SimpleOptions> {
}

const getStyles = () => {
    return {
        wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
        svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
        textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    };
};


const data: SensorData[] = sample_data.series.reduce((data, series) => {
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
// console.log(data);

export const SimplePanel: React.FC<Props> = ({options, data, width, height, fieldConfig}) => {
    const fieldColor = fieldConfig.defaults.color || {mode: FieldColorModeId.ContinuousGrYlRd};
    const fieldColorMode = fieldColorModeRegistry.get(fieldColor.mode);

    let colors = ["green", "orange", "yellow"]
    if (fieldColorMode.getColors) {
        colors = fieldColorMode.getColors(useTheme2());
    } else {
        const color = useTheme2().visualization.getColorByName(fieldColor.fixedColor!)
        colors = [color, colorManipulator.asHexString(colorManipulator.lighten(color, 0.5))];
    }
    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node && node as HTMLCanvasElement) {
            const floorRenderer = new FloorRenderer(node);
            floorRenderer.dpiFix(width, height);
            const data: { rooms: Room[], objects: CanvasElement[] } = JSON.parse(options["json"]);
            floorRenderer.rooms = data.rooms;
            floorRenderer.objects = data.objects;
            floorRenderer.redraw()
            floorRenderer.setColors(colors);
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
            floorRenderer.lineWidth = ratio;
            floorRenderer.pointSize = 20 * ratio;
        }
    }, [width, height, colors, options])
    const styles = useStyles2(getStyles);

    return (
        <div>
            <canvas className={cx(styles.wrapper, css`width: ${width}px; height: ${height}px;`)} ref={canvasRef}/>
        </div>
    );
};
