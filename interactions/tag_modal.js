import { fetchPlayer } from '../utils/royalApi.js';
import { setAccounts, getTicketByChannel } from '../utils/tickets.js';

export async function handleTagModal(interaction) {
  const [ , idx, , total ] = interaction.customId.split('_'); // e.g. tag_modal_2_of_3
  const tags = interaction.fields.getTextInputValue('tag_input').trim().toUpperCase();
  if (!tags.startsWith('#')) return interaction.reply({ content: 'Invalid tag format. Please try again.', ephemeral: true });

  // Validate tag with Royal API
  const player = await fetchPlayer(tags);
  if (!player || player.reason) return interaction.reply({ content: 'Could not find that player tag. Try again.', ephemeral: true });

  // Store tags temporarily in channel (in-memory or database, here we use ticket accounts jsonb)
  const ticket = await getTicketByChannel(interaction.channel.id);
  let accounts = ticket.accounts || [];
  // Prevent duplicates
  if (accounts.find(a => a.tag === tags)) return interaction.reply({ content: 'Duplicate tag entered.', ephemeral: true });
  accounts.push({ tag: tags, name: player.name, th: player.townHallLevel });
  await setAccounts(interaction.channel.id, accounts);

  if (accounts.length < Number(total)) {
    // Ask for next tag
    const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = await import('discord.js');
    const modal = new ModalBuilder()
      .setCustomId(`tag_modal_${accounts.length + 1}_of_${total}`)
      .setTitle('Enter Account Tag')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('tag_input')
            .setLabel('Player Tag (e.g. #ABC123)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );
    await interaction.showModal(modal);
  } else {
    // All tags collected, show Confirm button
    const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = await import('discord.js');
    const embed = new EmbedBuilder()
      .setTitle('Accounts Collected')
      .setDescription(accounts.map((a, i) => `**${i+1}.** ${a.name} (${a.tag}) - TH${a.th}`).join('\n'))
      .setColor(0x00bfff);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('confirm_accounts').setLabel('Confirm').setStyle('Success')
    );
    await interaction.reply({ embeds: [embed], components: [row] });
  }
}