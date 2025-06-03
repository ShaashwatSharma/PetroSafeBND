import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db"; // assuming you're exporting Prisma client
import {JWT_SECRET} from "../config";

const historyrouter = express.Router();


historyrouter.get("/history", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const history = await prisma.fuelReading.findMany({
      where: { userId: String(userId) },
      orderBy: { time: "asc" }
    });

    return res.json({ history });
  } catch (e) {
    return res.status(500).json({ message: "Error fetching history" });
  }
});

export default historyrouter;
