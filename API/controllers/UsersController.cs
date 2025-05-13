using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class usersController : ControllerBase
{
    private readonly LobbyManager _lobbyManager;

    public usersController(LobbyManager lobbyManager)
    {
        _lobbyManager = lobbyManager;
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        var users = _lobbyManager.GetAllUsers();
        return Ok(users);
    }

    [HttpPost]
    public IActionResult AddUser([FromBody] Player request)
    {
        if (_lobbyManager.AddUser(request.username, request.lobby, request.connectionId))
        {
            return Ok(new { message = "User added successfully." });
        }
        else
        {
            return BadRequest(new { message = "User already exists." });
        }
    }

}
