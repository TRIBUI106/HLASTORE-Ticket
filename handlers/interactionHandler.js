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
  roleSupport, // Đây giờ là một mảng
} = require("../config.js");

module.exports = async (interaction) => {
  const user = interaction.user;
  const channel = interaction.channel;
  const member = await interaction.guild.members.fetch(user.id);

  if (interaction.isButton()) {
    if (
      interaction.customId === "buy_ticket" ||
      interaction.customId === "support_ticket"
    ) {
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

      await interaction.showModal(modal);
    } else if (interaction.customId === "lock_ticket") {
      // Kiểm tra xem thành viên có ít nhất 1 trong 2 role support
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          ephemeral: true,
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
    } else if (interaction.customId === "unlock_ticket") {
      // Kiểm tra tương tự
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          ephemeral: true,
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
    } else if (interaction.customId === "close_ticket") {
      // Kiểm tra tương tự
      if (!roleSupport.some((roleId) => member.roles.cache.has(roleId))) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng chức năng này!",
          ephemeral: true,
        });
      }
      await channel.send(
        "🔒 Ticket này đã được đóng và di chuyển vào lưu trữ!"
      );
      await channel.setParent(closedTicketCategory);
      await interaction.reply({
        content: "🔒 Ticket đã được đóng!",
        ephemeral: true,
      });
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "ticket_reason") {
      const reason = interaction.fields.getTextInputValue("reason_input");
      const guild = interaction.guild;
      const ticketType =
        interaction.customId === "buy_ticket"
          ? "Mua hàng"
          : "Hỗ trợ / Bảo hành";

      // Tạo permissionOverwrites cho cả 2 role support
      const permissionOverwrites = [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
          ],
        },
        // Thêm quyền cho từng role trong mảng roleSupport
        ...roleSupport.map((roleId) => ({
          id: roleId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
          ],
        })),
      ];

      const ticketChannel = await guild.channels.create({
        name: `💌┃${interaction.user.username}`,
        type: 0, // ChannelType.GuildText
        parent: ticketCategory,
        topic: user.id,
        permissionOverwrites,
      });

      const embed = new EmbedBuilder()
        .setTitle("HeLa Store Ticket")
        .setDescription(`\n\u200B**📌 Mô tả : ${reason}**\n\u200B`)
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

      // Ping cả 2 role support
      const roleMentions = roleSupport
        .map((roleId) => `<@&${roleId}>`)
        .join(" ");
      await ticketChannel.send({
        content: `${roleMentions} | Ticket của <@${user.id}>`,
        embeds: [embed],
        components: [row],
      });
      await interaction.reply({
        content: `✅ Ticket của bạn đã được tạo tại ${ticketChannel}`,
        ephemeral: true,
      });
    }
  }
};
// Đoạn này là để xử lý các sự kiện từ interaction, như là nhấn nút hoặc gửi modal
// Tùy thuộc vào loại interaction mà sẽ thực hiện các hành động khác nhau
// Như là tạo ticket, khoá ticket, mở khoá ticket, đóng ticket
// Hoặc là hiển thị modal để nhập lý do tạo ticket
