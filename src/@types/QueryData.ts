export type QueryData = {
    state: string,
    series: Series[]
}

export type Series = {
    refId: string,
    fields: Field[]
}

export type Field = {
    name: string,
    labels: { "_time": string, "sensor_id": string },
    values: any[]
}

export type SensorData = {
    id: string,
    time: number,
    values: Map<string, number>
}

export type Measurement = {
    field: string,
    value: string
}