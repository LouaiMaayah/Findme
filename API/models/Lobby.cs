public class Lobby
{
    public required string name { get; set; }
    public List<string> users { get; set; } = [];
    public bool gameStarted { get; set; } = false;
}