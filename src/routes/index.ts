import express from "express";
import userRouter from "./user"
import cors from "cors";
import fuelrouter from "./fuel";
import historyrouter from "./history";
import alertrouter from "./alert";

const mainrouter = express.Router();
const app=express();
app.use(express.json());
app.use(cors());

mainrouter.use("/user",userRouter);
mainrouter.use("/fuel",fuelrouter);
mainrouter.use("/history",historyrouter);
mainrouter.use("/alert",alertrouter);


export default mainrouter;

