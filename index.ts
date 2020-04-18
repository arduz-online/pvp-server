
import { startTeamsMode } from "src/Arduz";
import { startBaseSystems, startServer } from "sdk";

startServer(async () => {
  await startBaseSystems()
  await startTeamsMode()
});

