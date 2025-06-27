import mqtt from 'mqtt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
  console.log('Backend connected to broker')
  client.subscribe('petroshield/fuel', (err) => {
    if (!err) {
      console.log('Subscribed to fuel topic')
    }
  })
})

client.on('message', async (topic, message) => {
  const data = JSON.parse(message.toString())
  console.log('Received sensor data:', data)

  try {
    await prisma.fuelLog.create({
      data: {
        sensorId: data.sensorId,
        vehicleId: data.vehicleId,
        fuelLevel: data.fuelLevel,
        latitude: data.location.lat,
        longitude: data.location.long
      }
    })
    console.log('✅ Data saved to DB')
  } catch (error) {
    console.error('❌ Error saving to DB:', error)
  }
})
