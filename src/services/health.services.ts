import { getDatabaseTime } from "../models/health.model";

export const getHealthStatus = async () => {

    console.log("Entro al health Service");

    const databaseTime = await getDatabaseTime();

    return {
        success: true,
        message: "API Pinify funcionando correctamente",
        databaseTime
    };
};

