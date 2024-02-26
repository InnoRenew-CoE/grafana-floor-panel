import {PanelPlugin} from '@grafana/data';
import {SimpleOptions} from './types';
import {SimplePanel} from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel)
    .useFieldConfig()
    .setPanelOptions(builder => {
        builder.addTextInput({
            path: 'json',
            settings: {
                placeholder: "Floor Plan JSON"
            },
            name: 'Floor plan JSON',
            description: 'JSON for the floor plan.',
            category: ["Floor Plan"],
            defaultValue: '{"rooms": [], "objects": []}',
        })
    })
;
