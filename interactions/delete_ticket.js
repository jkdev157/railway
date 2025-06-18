import { closeTicket, getTicketByChannel } from '../utils/tickets.js';

export async function handleDeleteTicket(interaction) {
  const ticket = await getTicketByChannel(interaction.channel.id);
  if (!ticket) return interaction.reply({ content: 'Ticket not found.', ephemeral: true });
  await closeTicket(interaction.channel.id);
  await interaction.reply('This ticket will be deleted in 3 seconds...');
  setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
}