import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } from 'discord.js';
import { ticketManager } from '../utils/ticketManager.js';

export async function handleApply(interaction) {
  // Check for existing ticket
  if (await ticketManager.hasTicket(interaction.user.id)) {
    return interaction.reply({ content: 'You already have an open application.', ephemeral: true });
  }

  // Create channel
  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: 0, // GuildText
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      // Add staff role IDs here with allow: [ViewChannel, SendMessages]
    ]
  });

  await ticketManager.createTicket(interaction.user.id, channel.id);

  // Welcome embed
  const embed = new EmbedBuilder()
    .setTitle('Welcome to the application process!')
    .setDescription(`<@${interaction.user.id}>, please follow the steps to apply for the clan.`)
    .setColor(0x00bfff);

  // Delete button
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('delete_ticket')
      .setLabel('Delete Ticket')
      .setStyle(ButtonStyle.Danger)
  );

  // Account count buttons
  const countRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('count_1').setLabel('1').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('count_2').setLabel('2').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('count_3').setLabel('3').setStyle(ButtonStyle.Primary)
  );

  await channel.send({ embeds: [embed], components: [row, countRow] });
  await interaction.reply({ content: `A ticket was created for you! ${channel}`, ephemeral: true });
}