require("dotenv").config();
const { spawn } = require("child_process");

const port = process.env.PORT || 5000;
const nextBin = require.resolve("next/dist/bin/next");
const args = ["start", "-p", String(port), ...process.argv.slice(2)];

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (code !== null) process.exit(code);
  if (signal) process.kill(process.pid, signal);
});
