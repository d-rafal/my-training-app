import { setupWorker } from "msw";

import { trainingsHandlers } from "./trainingsHandler";
import { authHandlers } from "./authHandler";

export const ARTIFICIAL_DELAY_MS = 2000;

export const worker = setupWorker(...trainingsHandlers, ...authHandlers);
