import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db"; // assuming you're exporting Prisma client
import {JWT_SECRET} from "../config";

const fuelrouter = express.Router();

fuelrouter.post("/fuel", async (req: Request, res: Response) => {
  try {
    const { level, time, userId } = req.body;

     if (!userId || level == null || !time) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const entry = await prisma.sensorData.create({
      data: {
        level,
        timestamp: new Date(time),
        userId
      }
    });

    return res.status(201).json({ message: "Fuel data saved", entry });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to save fuel data" });
  }
});


fuelrouter.get("/fuel", async (req: Request, res: Response) => {
  try {
   

    return res.status(400).json({
      Message:"Data was sent successfully"
     });
  } catch (e) {
    return res.status(500).json({ message: "Error fetching fuel data" });
  }
});



export default fuelrouter;
