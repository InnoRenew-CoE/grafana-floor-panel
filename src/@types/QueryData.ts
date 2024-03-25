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
    labels: { "_time": string },
    values: string[]
}

export type SensorData = {
    sensorId: string,
    time: string,
    measurements: Measurement[]
}

export type Measurement = {
    field: string,
    value: string
}