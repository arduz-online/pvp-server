import { startServer, startBaseSystems } from "index";
import { startTeamsMode } from "src/Arduz";

startServer(async () => {
  await startBaseSystems()
  await startTeamsMode()
});

