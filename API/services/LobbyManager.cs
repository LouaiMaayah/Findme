

public class LobbyManager
{
    private readonly Dictionary<string, Lobby> _lobbies = new();
    private readonly Dictionary<string, User> _users = new();

    public bool CreateLobby(string lobbyName)
    {
        lock (_lobbies)
        {
            if (_lobbies.ContainsKey(lobbyName))
                return false;

            _lobbies[lobbyName] = new Lobby
            {
                name = lobbyName,
                users = []

            };
            return true;
        }
    }

    public bool JoinLobby(string lobbyName, string username, string connectionId)
    {
        lock (_lobbies)
        {
            if (!_lobbies.TryGetValue(lobbyName, out var lobby))
                return false;

            if (!lobby.users.Contains(username))
            {
                lobby.users.Add(username);
                _users[username].connectionId = connectionId;
                _users[username].lobby = lobbyName;
            }

            return true;
        }
    }

    public bool LeaveLobby(string lobbyName, string username)
    {
        lock (_lobbies)
        {
            if (_lobbies[lobbyName].users.Contains(username))
            {
                _lobbies[lobbyName].users.Remove(username);
                _users[username].connectionId = null;
                _users[username].lobby = null;
                if (_lobbies[lobbyName].users.Count == 0)
                {
                    _lobbies.Remove(lobbyName);
                }
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    public User? GetUserByConnectionId(string connectionId)
    {
        lock (_users)
        {
            return _users.Values.FirstOrDefault(user => user.connectionId == connectionId);
        }
    }

    public bool LobbyExists(string lobbyName)
    {
        return _lobbies.ContainsKey(lobbyName);
    }

    public List<Lobby> GetAllLobbies()
    {
        return _lobbies.Values.ToList();
    }

    public List<User> GetAllUsers()
    {
        return _users.Values.ToList();
    }

    public List<string> GetUsersInLobby(string lobbyName)
    {
        if (_lobbies.TryGetValue(lobbyName, out var lobby))
        {
            return lobby.users;
        }
        return new List<string>();
    }

    public bool AddUser(string username, string? lobbyName, string? connectionId)
    {
        lock (_users)
        {
            if (_users.ContainsKey(username))
                return false;

            _users[username] = new User
            {
                username = username,
                connectionId = connectionId,
                lobby = lobbyName
            };
            return true;
        }
    }

    public bool UserExists(string username)
    {
        lock (_users)
        {
            return _users.ContainsKey(username);
        }
    }

    public void StartGame(string lobbyName)
    {
        lock (_lobbies)
        {
            if (_lobbies.TryGetValue(lobbyName, out var lobby))
            {
                lobby.gameStarted = true;
            }
        }
    }
}
