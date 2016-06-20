class ServerStatus
{
    constructor(version, players, description, favicon)
    {
        this.version = version;
        this.players = players;
        this.description = description;
        this.favicon = favicon;
    }
}

module.exports = ServerStatus;