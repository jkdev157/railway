import { supabase } from './supabase.js';

export async function setGuildConfig(guildId, { clanName, clanTag, minTH, channelId, staffRole }) {
  await supabase.from('guilds').upsert({
    guild_id: guildId,
    clan_name: clanName,
    clan_tag: clanTag,
    min_th: minTH,
    panel_channel: channelId,
    staff_role: staffRole
  });
}

export async function getGuildConfig(guildId) {
  const { data } = await supabase
    .from('guilds')
    .select('*')
    .eq('guild_id', guildId)
    .maybeSingle();
  return data;
}