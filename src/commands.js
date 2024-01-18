require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "bitcoin",
    description: "Get the latest price and other details about Bitcoin",
  },
  {
    name: "ethereum",
    description:
      "Get the latest price and other details about ethereum Cryptocurrency",
  },
  {
    name: "shiba",
    description: "Get the latest price and other details about Shiba coin",
  },
  {
    name: "dogecoin",
    description: "Get the latest price and other details about Doge coin",
  },
  {
    name: "solana",
    description: "Get the latest price and other details about Solana coin",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const regCommands = async () => {
  console.log("first");
  try {
    console.log("start");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.BOT_ID,
        process.env.SERVER_ID
      ),
      {
        body: commands,
      }
    );
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};

regCommands();
