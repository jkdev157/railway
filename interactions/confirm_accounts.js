import { getGuildConfig } from '../utils/guildConfig.js';
import { getTicketByChannel, closeTicket } from '../utils/tickets.js';

export async function handleConfirm(interaction) {
  const guildConfig = await getGuildConfig(interaction.guild.id);
  const ticket = await getTicketByChannel(interaction.channel.id);
  const accounts = ticket.accounts || [];

  // TH check
  const failed = accounts.find(acc => acc.th < guildConfig.min_th);
  if (failed) {
    await interaction.reply({ content: `❌ Account ${failed.name} (${failed.tag}) does not meet the minimum Town Hall requirement (TH${guildConfig.min_th}). Ticket will be closed.`, ephemeral: true });
    await closeTicket(interaction.channel.id);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    return;
  }

  // Notify staff
  const { EmbedBuilder } = await import('discord.js');
  const embed = new EmbedBuilder()
    .setTitle('New Clan Application')
    .setDescription([
      `<@${ticket.user_id}> has applied for **${guildConfig.clan_name}** (${guildConfig.clan_tag}).`,
      '',
      accounts.map((a, i) => `**${i+1}.** ${a.name} (${a.tag}) - TH${a.th}`).join('\n'),
      '',
      'Staff will handle your application soon.'
    ].join('\n'))
    .setColor(0x57F287);

  await interaction.channel.send({ content: `<@&${guildConfig.staff_role}>`, embeds: [embed] });
  await interaction.reply({ content: '✅ Application submitted! Staff will handle your application soon.', ephemeral: true });
}