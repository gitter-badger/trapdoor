class PacketStatusResponse
{
    constructor(status)
    {
        this.responseObject = 
         {
            "version": status.version,
            "players": status.players,
            "description": status.description,
            "favicon": status.favicon
        }
    }

    toString()
    {
        return JSON.stringify(this.responseObject);
    }
}

module.exports = PacketStatusResponse;