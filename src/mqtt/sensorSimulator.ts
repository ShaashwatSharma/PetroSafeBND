const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883') // or your broker URL

client.on('connect', () => {
  console.log('Sensor connected to broker')
  setInterval(() => {
    const fuelData = {
      sensorId: "sensor-001",
      vehicleId: "vehicle-001",
      fuelLevel: Math.floor(Math.random() * 100),
      location: { lat: 28.61, long: 77.20 },
      timestamp: new Date().toISOString()
    }
    client.publish('petroshield/fuel', JSON.stringify(fuelData))
    console.log('Published data:', fuelData)
  }, 5000) // every 5 seconds 
})
