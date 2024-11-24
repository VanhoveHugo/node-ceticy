import { app } from "./app";
import { config } from "./config";

app.listen(config.PORT, () => {
  console.info(`Server is running on http://localhost:${config.PORT}`);
});
