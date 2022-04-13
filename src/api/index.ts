import authApi from "./authApi";
import trainingsApi from "./trainingApi";

const api = { auth: authApi, trainings: trainingsApi };

export type AppApi = typeof api;
export default api;
