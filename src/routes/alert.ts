import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db"; // assuming you're exporting Prisma client
import {JWT_SECRET} from "../config";

const alertrouter = express.Router();

alertrouter.get("/alerts", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const alerts = await prisma.alert.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ alerts });
  } catch (e) {
    return res.status(500).json({ message: "Error fetching alerts" });
  }
});

export default alertrouter;