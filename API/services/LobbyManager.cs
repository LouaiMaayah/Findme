

public class LobbyManager
{
    private readonly Dictionary<string, Lobby> _lobbies = new();

    public bool CreateLobby(string lobbyName, string username)
    {

        lock (_lobbies)
        {
            if (_lobbies.ContainsKey(lobbyName))
                return false;

            _lobbies[lobbyName] = new Lobby
            {
                name = lobbyName,
                users = new List<string> { username }
            };
            return true;
        }
    }

    public bool JoinLobby(string lobbyName, string username)
    {
        lock (_lobbies)
        {
            if (!_lobbies.TryGetValue(lobbyName, out var lobby))
                return false;

            if (!lobby.users.Contains(username))
                lobby.users.Add(username);

            return true;
        }
    }

    public bool LobbyExists(string lobbyName)
    {
        lock (_lobbies)
        {
            return _lobbies.ContainsKey(lobbyName);
        }
    }

    public Lobby? GetLobby(string lobbyName)
    {
        lock (_lobbies)
        {
            _lobbies.TryGetValue(lobbyName, out var lobby);
            return lobby;
        }
    }

     public List<Lobby> GetAllLobbies()
    {
        return _lobbies.Values.ToList();
    }
}
