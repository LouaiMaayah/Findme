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

        if (!_lobbyManager.CreateLobby(lobbyName))
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

        if (_lobbyManager.GetUsersInLobby(lobbyName).Count >= 8)
        {
            await Clients.Caller.SendAsync("LobbyError", "Lobby is full.");
            return;
        }

        _lobbyManager.JoinLobby(lobbyName, username, Context.ConnectionId);
        await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);

        var users = _lobbyManager.GetUsersInLobby(lobbyName);
        await Clients.Group(lobbyName).SendAsync("UserListUpdated", users);
    }

    public async Task LeaveLobby(string lobbyName, string username)
    {
        if (!_lobbyManager.LobbyExists(lobbyName))
        {
            await Clients.Caller.SendAsync("LobbyError", "Lobby does not exist.");
            return;
        }

        _lobbyManager.LeaveLobby(lobbyName, username);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, lobbyName);

        var users = _lobbyManager.GetUsersInLobby(lobbyName);
        await Clients.Group(lobbyName).SendAsync("UserListUpdated", users);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        User? user = _lobbyManager.GetUserByConnectionId(Context.ConnectionId);
        if (user != null && user.lobby != null)
        {
            string lobbyName = user.lobby;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.lobby);
            _lobbyManager.LeaveLobby(user.lobby, user.username);

            _logger.LogInformation($"User {user.username} disconnected from lobby {user.lobby}.");

            var users = _lobbyManager.GetUsersInLobby(lobbyName);
            await Clients.Group(lobbyName).SendAsync("UserListUpdated", users);
        }
        await base.OnDisconnectedAsync(exception);
    }
}
