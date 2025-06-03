import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import zod from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db"; // assuming you're exporting Prisma client
import {JWT_SECRET} from "../config";

const router = express.Router();

const signupSchema = zod.object({
  email: zod.string().email(),
  name: zod.string(),
  password: zod.string().min(6)
});

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(411).json({
        message: "Invalid input fields"
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "User created successfully",
      token
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});


router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Logged in successfully",
      token
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});







export default router;
