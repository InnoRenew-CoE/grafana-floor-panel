# Floor Plan Indoor Air Quality monitoring
<p style="text-align:center; opacity: 0.5">(soon interactive)</p>

![img.png](img.png)

### Features
- [x] Air Quality rendering
- [x] Easy configuration and setup
- [ ] Interactive rooms
- [ ] Detailed charts of IAQ history.

### Short description
Monitoring indoor air quality through floor plan visualization in Grafana using Flux query language allows for gaining valuable insights into the air quality of different areas within a building. 
By integrating sensors and data collection points throughout the building, Grafana can display real-time and historical air quality data on a floor plan layout. 
This enables users to easily identify areas with poor air quality and take appropriate actions to improve it, such as adjusting ventilation systems or implementing air purifiers. Overall, this approach enhances indoor air quality management and contributes to creating healthier and more comfortable environments for occupants.

### Flux Query Example
```flux
site_results = from(bucket: "iaq")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "iaq_data")
  |> filter(fn: (r) => r["building"] == "innorenew")

sensor_ids = site_results 
  |> map(fn: (r) => ({r with _value: string(v:r._value)}))
  |> keep(columns: ["_time", "_value", "_field", "sensor_id"])

mapped_sensors = sensor_ids
  |> truncateTimeColumn(unit: 1m)
  |> pivot(rowKey: ["_time", "_field"], columnKey: ["sensor_id"], valueColumn: "_value")
  |> group(columns: ["_time"])

mapped_sensors
```

#### Note:
The plugin is not yet signed and is not available through the grafana store.