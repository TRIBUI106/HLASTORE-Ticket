const { Client, GatewayIntentBits } = require("discord.js");
const { prefix, token } = require("./config.js");
const handleInteraction = require("./handlers/interactionHandler");
const handleTicketCommand = require("./handlers/ticketHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once("ready", () => {
  console.log(`Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === "setup") {
    handleTicketCommand(message);
  }
});

client.on("interactionCreate", async (interaction) => {
  handleInteraction(interaction);
});

client.login(token);
