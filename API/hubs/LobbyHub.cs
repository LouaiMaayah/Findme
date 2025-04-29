using Microsoft.AspNetCore.SignalR;



public class LobbyHub : Hub
{

private readonly ILogger<LobbyHub> _logger;
    private readonly LobbyManager _lobbyManager;

public LobbyHub(LobbyManager lobbyManager, ILogger<LobbyHub> logger)
{
    _lobbyManager = lobbyManager;
    _logger = logger;
}

    public async Task CreateLobby(string lobbyName, string username)
    {

        if (!_lobbyManager.CreateLobby(lobbyName, username))
        {
            await Clients.Caller.SendAsync("LobbyError", "Lobby name already exists.");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        await Clients.Caller.SendAsync("LobbyCreated", lobbyName);
    }

    public async Task JoinLobby(string lobbyName, string username)
    {
        if (!_lobbyManager.LobbyExists(lobbyName))
        {
            await Clients.Caller.SendAsync("LobbyError", "Lobby does not exist.");
            return;
        }

        _lobbyManager.JoinLobby(lobbyName, username);
        await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        await Clients.Group(lobbyName).SendAsync("UserJoined", username);
    }

    public async Task GetUsersInLobby(string lobbyName){
        var lobby = _lobbyManager.GetLobby(lobbyName);
        if (lobby == null)
        {
            await Clients.Caller.SendAsync("LobbyError", "Lobby does not exist.");
            return;
        }

        await Clients.Caller.SendAsync("UsersInLobby", lobby.users);
    }
}
