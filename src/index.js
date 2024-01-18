require("dotenv").config();
const {
  Client,
  IntentsBitField,
  Attachment,
  EmbedBuilder,
} = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const canvas = new ChartJSNodeCanvas({ width: 400, height: 400 });

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("interactionCreate", async (int) => {
  if (!int.isChatInputCommand()) return;
  const split = int.commandName.slice(1);
  const firstLetter = int.commandName.substring(0, 1).toUpperCase();
  const formatted_name = firstLetter + split;

  await int.deferReply();
  const api_key = "";
  const request_url = `https://api.coingecko.com/api/v3/coins/${int.commandName}/market_chart?vs_currency=usd&days=2`;
  const get_coin_data = `https://api.coingecko.com/api/v3/coins/${int.commandName}`;
  (async () => {
    try {
      const req = await fetch(`${request_url}`);
      const req2 = await fetch(get_coin_data);
      const res = await req.json();
      const res2 = await req2.json();
      const prices = res.prices;
      const coinData = res2.market_data;
      const ath = coinData.ath.usd;
      const atl = coinData.atl.usd;
      const ath_change_percentage = coinData.ath_change_percentage.usd;
      const atl_change_percentage = coinData.atl_change_percentage.usd;
      const ath_date = coinData.ath_date.usd;
      const atl_date = coinData.atl_date.usd;
      const filteredPrices = prices.map(([volume, price]) => ({
        volume,
        price,
      }));

      const data = {
        labels: filteredPrices
          .map((price, _index) => `${_index + 1}hr`)
          .reverse(),
        datasets: [
          {
            label: "Example Chart",
            data: filteredPrices.map((price, _index) => price.price),
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: (context) => {
              const currentIndex = context.dataIndex;
              if (currentIndex > 0) {
                return context.dataset.data[currentIndex] >
                  context.dataset.data[currentIndex - 1]
                  ? "rgba(0, 255, 0, 1)"
                  : "rgba(255, 0, 0, 1)";
              }
              return "rgba(0, 255, 0, 1)";
            },

            borderWidth: 1,
          },
        ],
      };

      const chart = await canvas.renderToBuffer({
        type: "line",
        data: data,
      });

      const embed = new EmbedBuilder()
        .setTitle(`${formatted_name} price chart`)
        .setDescription(
          `${formatted_name} current price is ${
            filteredPrices[filteredPrices.length - 1].price
          }`
        )
        .setTimestamp(new Date())
        .setFooter({ text: "Chart Bot" })
        .addFields([
          {
            name: "All-Time High",
            value: ath.toString(),
            inline: true,
          },
          {
            name: "All-Time Low",
            value: atl.toString(),
            inline: true,
          },
          {
            name: "All-Time High percentage change",
            value: ath_change_percentage.toString(),
            inline: true,
          },
          {
            name: "All-Time Low percentage change",
            value: atl_change_percentage.toString(),
            inline: true,
          },
          {
            name: "All-Time High date",
            value: ath_date.toString(),
            inline: true,
          },
          {
            name: "All-Time Low date",
            value: atl_date.toString(),
            inline: true,
          },
        ])
        .setColor("Random")
        .setURL(`https://api.coingecko.com/api/v3/coins/${int.commandName}`);
      int.editReply({
        embeds: [embed],
        files: [chart],
      });
    } catch (error) {
      console.log(error);
      int.editReply(`Sorry, I could not get any info about ${formatted_name}`);
    }
  })();
  // }
});

client.on("ready", async () => {
  setInterval(async () => {
    const targetChannelId = "1197186006227632199";
    const targetChannel = client.channels.cache.get(targetChannelId);

    if (targetChannel) {
      await sendChart(targetChannel, "bitcoin", "Bitcoin");
      await sendChart(targetChannel, "shiba", "Shiba");
      await sendChart(targetChannel, "ethereum", "Ethereum");
      await sendChart(targetChannel, "dogecoin", "Dogecoin");
      await sendChart(targetChannel, "solana", "Solana");
    } else {
      console.error(`Channel ${targetChannelId} not found.`);
    }
  }, 60000);
});

async function sendChart(channel, coin, coinName) {
  const request_url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=2`;
  // const get_coin_data = `https://api.coingecko.com/api/v3/coins/${coin}`;
  try {
    const req = await fetch(`${request_url}`);
    const res = await req.json();
    const prices = await res?.prices;
    const filteredPrices = prices?.map(([volume, price]) => ({
      volume,
      price,
    }));

    if (filteredPrices) {
      const data = {
        labels: filteredPrices
          .map((price, _index) => `${_index + 1}hr`)
          .reverse(),
        datasets: [
          {
            label: "Example Chart",
            data: filteredPrices.map((price, _index) => price.price),
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: (context) => {
              const currentIndex = context.dataIndex;
              if (currentIndex > 0) {
                return context.dataset.data[currentIndex] >
                  context.dataset.data[currentIndex - 1]
                  ? "rgba(0, 255, 0, 1)"
                  : "rgba(255, 0, 0, 1)";
              }
              return "rgba(0, 255, 0, 1)";
            },

            borderWidth: 1,
          },
        ],
      };

      const chart = await canvas.renderToBuffer({
        type: "line",
        data: data,
      });

      const embed = new EmbedBuilder()
        .setTitle(`${coinName} price chart`)
        .setDescription(
          `${coinName} current price is ${
            filteredPrices[filteredPrices.length - 1].price
          }`
        )
        .setTimestamp(new Date())
        .setFooter({ text: "Chart Bot" })
        // .addFields([
        //   {
        //     name: "All-Time High",
        //     value: ath.toString(),
        //     inline: true,
        //   },
        //   {
        //     name: "All-Time Low",
        //     value: atl.toString(),
        //     inline: true,
        //   },
        //   {
        //     name: "All-Time High percentage change",
        //     value: ath_change_percentage.toString(),
        //     inline: true,
        //   },
        //   {
        //     name: "All-Time Low percentage change",
        //     value: atl_change_percentage.toString(),
        //     inline: true,
        //   },
        //   {
        //     name: "All-Time High date",
        //     value: ath_date.toString(),
        //     inline: true,
        //   },
        //   {
        //     name: "All-Time Low date",
        //     value: atl_date.toString(),
        //     inline: true,
        //   },
        // ])
        .setColor("Random")
        .setURL(`https://api.coingecko.com/api/v3/coins/${coin}`);
      await channel.send({
        embeds: [embed],
        files: [chart],
      });
    }
  } catch (error) {
    console.log(error);
    `Sorry, I could not get any info about ${coinName}`;
  }
}

client.login(process.env.TOKEN);
