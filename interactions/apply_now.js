import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig } from '../utils/guildConfig.js';
import { hasOpenTicket, createTicket } from '../utils/tickets.js';

export async function handleApplyNow(interaction) {
  const guildConfig = await getGuildConfig(interaction.guild.id);
  if (!guildConfig) return interaction.reply({ content: '❌ Server not configured. Please ask an admin to run `/ticket-setup`.', ephemeral: true });

  if (await hasOpenTicket(interaction.guild.id, interaction.user.id)) {
    return interaction.reply({ content: 'You already have an open application.', ephemeral: true });
  }

  // Create private ticket channel
  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`.slice(0, 32),
    type: 0, // GuildText
    parent: null,
    permissionOverwrites: [
      { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      { id: guildConfig.staff_role, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
    ]
  });

  await createTicket(interaction.guild.id, interaction.user.id, channel.id);

  // Welcome, Delete Button, Account Count buttons
  const embed = new EmbedBuilder()
    .setTitle('Welcome to the application process!')
    .setDescription(`<@${interaction.user.id}>, please follow the steps below to apply for the clan.`)
    .setColor(0x00bfff);

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('delete_ticket')
      .setLabel('Delete Ticket')
      .setStyle('Danger')
  );
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('count_1').setLabel('1 Account').setStyle('Primary'),
    new ButtonBuilder().setCustomId('count_2').setLabel('2 Accounts').setStyle('Primary'),
    new ButtonBuilder().setCustomId('count_3').setLabel('3 Accounts').setStyle('Primary')
  );

  await channel.send({ embeds: [embed], components: [row1, row2] });
  await interaction.reply({ content: `A ticket was created for you! <#${channel.id}>`, ephemeral: true });
       }
