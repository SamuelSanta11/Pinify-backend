import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.services";

export const healthCheck = async(req: Request, res: Response): Promise<void> => {

    console.log("Entro al health Controller");

    const response = await getHealthStatus();
    
    res.status(200).json(response);
    
};



