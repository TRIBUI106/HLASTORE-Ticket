const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  PermissionsBitField,
} = require("discord.js");
const {
  closedTicketCategory,
  ticketCategory,
  roleSupport,
} = require("../config.js");

module.exports = async (interaction) => {
  const user = interaction.user;
  const channel = interaction.channel;

  // Fetch member chỉ khi cần
  const fetchMember = async () => interaction.guild.members.fetch(user.id);

  if (interaction.isButton()) {
    // Xử lý nút "buy_ticket" hoặc "support_ticket"
    if (["buy_ticket", "support_ticket"].includes(interaction.customId)) {
      const modal = new ModalBuilder()
        .setCustomId("ticket_reason")
        .setTitle("HeLa Store");

      const reasonInput = new TextInputBuilder()
        .setCustomId("reason_input")
        .setLabel("Mô tả / Lý do tạo ticket")
        .setPlaceholder("Nhập mô tả sản phẩm hoặc lý do ticket")
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(5)
        .setMaxLength(150);

      const actionRow = new ActionRowBuilder().addComponents(reasonInput);
      modal.addComponents(actionRow);

      // Gửi modal trực tiếp
      await interaction.showModal(modal);
    }

    // Xử lý nút "lock_ticket"
    else if (interaction.customId === "lock_ticket") {
      const member = await fetchMember();
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          flags: 64, // Ephemeral flag
        });
      }

      await channel.permissionOverwrites.edit(channel.topic, {
        ViewChannel: false,
      });
      await interaction.update({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("unlock_ticket")
              .setLabel("🔓 Mở Khoá")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("close_ticket")
              .setLabel("❌ Đóng Ticket")
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
      });
    }

    // Xử lý nút "unlock_ticket"
    else if (interaction.customId === "unlock_ticket") {
      const member = await fetchMember();
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          flags: 64,
        });
      }

      await channel.permissionOverwrites.edit(channel.topic, {
        ViewChannel: true,
      });
      await interaction.update({
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("lock_ticket")
              .setLabel("🔒 Khoá Ticket")
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId("close_ticket")
              .setLabel("❌ Đóng Ticket")
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
      });
    }

    // Xử lý nút "close_ticket"
    else if (interaction.customId === "close_ticket") {
      const member = await fetchMember();
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          flags: 64,
        });
      }

      await channel.send(
        "🔒 Ticket này đã được đóng và di chuyển vào lưu trữ!"
      );
      await channel.setParent(closedTicketCategory);
      await interaction.reply({
        content: "🔒 Ticket đã được đóng!",
        flags: 64,
      });
    }
  }

  // Xử lý modal submit
  else if (
    interaction.isModalSubmit() &&
    interaction.customId === "ticket_reason"
  ) {
    const reason = interaction.fields.getTextInputValue("reason_input");
    const guild = interaction.guild;
    const ticketType = interaction.customId.includes("buy_ticket")
      ? "Mua hàng"
      : "Hỗ trợ / Bảo hành";

    // Cấu hình quyền cho channel
    const permissionOverwrites = [
      { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      {
        id: user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.AttachFiles,
        ],
      },
      ...roleSupport.map((roleId) => ({
        id: roleId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
        ],
      })),
    ];

    // Tạo ticket channel
    const ticketChannel = await guild.channels.create({
      name: `💌┃${user.username}`,
      type: 0, // GuildText
      parent: ticketCategory,
      topic: user.id,
      permissionOverwrites,
    });

    // Tạo embed
    const embed = new EmbedBuilder()
      .setTitle("HeLa Store Ticket")
      .setDescription(`\n\u200B**📌 Mô tả: ${reason}**\n\u200B`)
      .setColor("#FF9900")
      .setImage(
        "https://media.discordapp.net/attachments/1346922255023738922/1347246480121004133/Gif_Banner_Hela.gif?ex=67cb208f&is=67c9cf0f&hm=e329f37c93afab7db131ce4b61d6a2c43f5c110c0e993f0153a4d4ec4b6abcd5&=&width=720&height=405"
      )
      .addFields(
        { name: "👤 Người tạo", value: `<@${user.id}>`, inline: true },
        { name: "✨ Loại ticket", value: ticketType, inline: true },
        {
          name: "🕛 Thời gian tạo",
          value: new Date().toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
          inline: true,
        }
      );

    // Tạo nút
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("lock_ticket")
        .setLabel("Khoá Ticket")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("close_ticket")
        .setLabel("Đóng Ticket")
        .setStyle(ButtonStyle.Secondary)
    );

    // Gửi thông báo ticket
    const roleMentions = roleSupport.map((roleId) => `<@&${roleId}>`).join(" ");
    await ticketChannel.send({
      content: `${roleMentions} | Ticket của <@${user.id}>`,
      embeds: [embed],
      components: [row],
    });

    // Phản hồi người dùng
    await interaction.reply({
      content: `✅ Ticket của bạn đã được tạo tại ${ticketChannel}`,
      flags: 64,
    });
  }
};
