public enum GameState
{
    WaitingForAdminToStart,
    PlayersAreHiding,
    Started
}

public class Lobby
{
    public required string name { get; set; }
    public List<string> users { get; set; } = [];
    public required GameState gameState { get; set; } = GameState.WaitingForAdminToStart;
}
