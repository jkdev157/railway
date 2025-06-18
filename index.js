import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { DISCORD_BOT_TOKEN } from './config.js';

// Commands and interaction handlers
import * as ticketSetup from './commands/ticket-setup.js';
import { handleApplyNow } from './interactions/apply_now.js';
import { handleDeleteTicket } from './interactions/delete_ticket.js';
import { handleAccountCount } from './interactions/count_select.js';
import { handleTagModal } from './interactions/tag_modal.js';
import { handleConfirm } from './interactions/confirm_accounts.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();
client.commands.set(ticketSetup.data.name, ticketSetup);

client.once('ready', () => {
  console.log(`Bot ready as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  try {
    // Slash command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (command) await command.execute(interaction);
    }
    // Button
    if (interaction.isButton()) {
      if (interaction.customId === 'apply_now') return handleApplyNow(interaction);
      if (interaction.customId === 'delete_ticket') return handleDeleteTicket(interaction);
      if (interaction.customId.startsWith('count_')) return handleAccountCount(interaction);
      if (interaction.customId === 'confirm_accounts') return handleConfirm(interaction);
    }
    // Modal
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('tag_modal_')) return handleTagModal(interaction);
    }
  } catch (e) {
    console.error(e);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ An error occurred.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
    }
  }
});

client.login(DISCORD_BOT_TOKEN);