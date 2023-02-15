CREATE TABLE IF NOT EXISTS users (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    xp INT NOT NULL,
    PRIMARY KEY (user_id)
);
