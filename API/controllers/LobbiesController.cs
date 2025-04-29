// In your controller or minimal API setup
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class lobbiesController : ControllerBase
{
    private readonly LobbyManager _lobbyManager;

    public lobbiesController(LobbyManager lobbyManager)
    {
        _lobbyManager = lobbyManager;
    }

    [HttpGet]
    public IActionResult GetAllLobbies()
    {
        var lobbies = _lobbyManager.GetAllLobbies();
        return Ok(lobbies);
    }
}
