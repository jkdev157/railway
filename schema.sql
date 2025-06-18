-- Guild (server) configuration
create table if not exists guilds (
  guild_id text primary key,
  clan_name text not null,
  clan_tag text not null,
  min_th integer not null,
  panel_channel text not null,
  staff_role text not null
);

-- Ticket tracking
create table if not exists tickets (
  id uuid primary key default uuid_generate_v4(),
  guild_id text not null,
  user_id text not null,
  channel_id text not null,
  status text not null default 'open',
  accounts jsonb,
  created_at timestamp with time zone default now()
);