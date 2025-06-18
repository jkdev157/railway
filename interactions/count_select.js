import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export async function handleAccountCount(interaction) {
  const count = Number(interaction.customId.split('_')[1]);
  if (![1, 2, 3].includes(count)) {
    return interaction.reply({ content: 'Invalid account count.', ephemeral: true });
  }
  // Start with first tag modal
  const modal = new ModalBuilder()
    .setCustomId(`tag_modal_1_of_${count}`)
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
}