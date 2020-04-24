
import { startTeamsMode } from "src/Arduz";
import { startBaseSystems, startServer } from "arduz-sdk";

startServer(async () => {
  await startBaseSystems()
  await startTeamsMode()
  log('hia')
});

