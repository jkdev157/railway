import { supabase } from './supabase.js';

export async function hasOpenTicket(guildId, userId) {
  const { data } = await supabase
    .from('tickets')
    .select('id')
    .eq('guild_id', guildId)
    .eq('user_id', userId)
    .eq('status', 'open')
    .maybeSingle();
  return !!data;
}

export async function createTicket(guildId, userId, channelId) {
  await supabase.from('tickets').insert({
    guild_id: guildId,
    user_id: userId,
    channel_id: channelId,
    status: 'open'
  });
}

export async function closeTicket(channelId) {
  await supabase.from('tickets').update({ status: 'closed' }).eq('channel_id', channelId);
}

export async function setAccounts(channelId, accounts) {
  await supabase.from('tickets').update({ accounts }).eq('channel_id', channelId);
}

export async function getTicketByChannel(channelId) {
  const { data } = await supabase
    .from('tickets')
    .select('*')
    .eq('channel_id', channelId)
    .maybeSingle();
  return data;
}
