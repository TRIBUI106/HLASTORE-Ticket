const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = async (message) => {
  const embed = new EmbedBuilder()

    .setAuthor({
      name: "HeLa",
      iconURL:
        "https://images-ext-1.discordapp.net/external/oMnMGL96qlwNpHCpTjr-X6hS4lrx8y5qjXSxspSNaQ4/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/555673812222607376/cc292bd5a3c425fc207f8a6d5defe8cf.png?format=webp&quality=lossless&width=230&height=230",
    })
    .setTitle("HeLa Store Ticket System")
    .setDescription(
      "Nếu bạn cần mua hàng hoặc hỗ trợ bảo hành, vui lòng chọn nút bên dưới."
    )
    .setColor("#db8cda")
    .setFooter({
      text: "HeLa Store | Made With 💓",
      iconURL:
        "https://media.discordapp.net/attachments/1346922255023738922/1346922298124537946/logo.jpg?ex=67c9f2a4&is=67c8a124&hm=3428bc1859ded00165e8bacbd6ba3160a0f85449796ed5f2b3f5d0bc24e65a97&=&format=webp&width=670&height=670",
    })
    .setImage(
      "https://media.discordapp.net/attachments/1346922255023738922/1347246480121004133/Gif_Banner_Hela.gif?ex=67cb208f&is=67c9cf0f&hm=e329f37c93afab7db131ce4b61d6a2c43f5c110c0e993f0153a4d4ec4b6abcd5&=&width=720&height=405"
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buy_ticket")
      .setLabel("🛒 Mua hàng")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("support_ticket")
      .setLabel("🏦 Hỗ Trợ / Bảo Hành")
      .setStyle(ButtonStyle.Success)
  );

  await message.channel.send({ embeds: [embed], components: [row] });
};
