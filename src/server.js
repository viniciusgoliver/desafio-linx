const app = require("./app");

app
  .listen(3000)
  .on("listening", () => {
    console.log("🚀 Server started on port 3000!");
  })
  .on("error", (err) => {
    console.log("❌ Erro ao iniciar o servidor: ", err);
  });
