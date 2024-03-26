import {PanelPlugin} from '@grafana/data';
import {SimpleOptions} from './types';
import {SimplePanel} from './components/SimplePanel';
import {RoomSensorPicker} from "./components/RoomSensorPicker";

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
        .useFieldConfig()
        .setPanelOptions(builder => {
            builder.addTextInput({
                name: "json",
                path: "json",
                defaultValue: `{"rooms":[], "objects": []}`,
                category: ["Floor Plan"]
            })
            builder.addCustomEditor({
                editor: RoomSensorPicker,
                id: "sensorMappings",
                path: 'sensorMappings',
                name: 'Floor plan JSON',
                description: 'JSON for the floor plan.',
                category: ["Floor Plan"],
            })
        })
    // { "rooms": [], "objects": [] }
;
