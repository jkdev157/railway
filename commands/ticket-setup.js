import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { setGuildConfig } from '../utils/guildConfig.js';

export const data = new SlashCommandBuilder()
  .setName('ticket-setup')
  .setDescription('Setup clan application ticket panel')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(opt =>
    opt.setName('channel')
      .setDescription('Channel for application panel')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName('clan')
      .setDescription('Clan name')
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName('tag')
      .setDescription('Clan tag')
      .setRequired(true)
  )
  .addIntegerOption(opt =>
    opt.setName('minth')
      .setDescription('Minimum Town Hall level')
      .setRequired(true)
  )
  .addRoleOption(opt =>
    opt.setName('staffrole')
      .setDescription('Staff role to manage tickets')
      .setRequired(true)
  );

export async function execute(interaction) {
  const channel = interaction.options.getChannel('channel');
  const clan = interaction.options.getString('clan');
  const tag = interaction.options.getString('tag');
  const minth = interaction.options.getInteger('minth');
  const staffRole = interaction.options.getRole('staffrole');

  await setGuildConfig(interaction.guild.id, {
    clanName: clan,
    clanTag: tag,
    minTH: minth,
    channelId: channel.id,
    staffRole: staffRole.id
  });

  const embed = new EmbedBuilder()
    .setTitle('📩 Apply to join a clan')
    .setDescription([
      `To apply for **${clan}** (${tag}), click the button below and fill out the application.`,
      `Minimum Town Hall: **${minth}**`
    ].join('\n'))
    .setColor(0x00bfff);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('apply_now')
      .setLabel('Apply Now!')
      .setStyle('Success')
  );

  await channel.send({ embeds: [embed], components: [row] });
  await interaction.reply({ content: '✅ Application panel sent and configuration saved!', ephemeral: true });
                   }
