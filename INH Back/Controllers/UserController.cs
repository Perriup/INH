using Microsoft.AspNetCore.Mvc;

namespace INH_Back.Controllers
{
    using Microsoft.EntityFrameworkCore;
    using INH_Back.Data;
    using INH_Back.Models;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Net.Http;
    using Newtonsoft.Json;
    using System.IdentityModel.Tokens.Jwt;
    using System.Text;
    using Microsoft.IdentityModel.Tokens;
    using System.Security.Claims;
    using System;


    //this is the controller responsible for OAuth and user management
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.Include(u => u.Posts).ThenInclude(p => p.Comments).ToListAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _context.Users.Include(u => u.Posts).ThenInclude(p => p.Comments).FirstOrDefaultAsync(u => u.Sub == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate != null)
            {
                _context.Users.Remove(userToUpdate);
            }

            user.Sub = id;

            _context.Users.Add(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Sub == id);
        }

        //validate google OAUth2 token
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] string token)
        {
            var logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<UserController>();

            logger.LogInformation("Authenticating user");

            var httpClient = new HttpClient();

            try
            {
                logger.LogInformation($"Validating token: {token}");

                var response = await httpClient.GetStringAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}");

                logger.LogInformation($"Response: {response}");

                var googleUser = JsonConvert.DeserializeObject<GoogleUser>(response);

                var test = JsonConvert.DeserializeObject(response);

                logger.LogInformation($"Google user: {googleUser}");

                if (googleUser == null)
                {
                    return BadRequest();
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == googleUser.Email);

                if (user == null)
                {
                    user = new User
                    {
                        Email = googleUser.Email,
                        Sub = Guid.NewGuid().ToString(),
                        Role = "User",
                        Name = googleUser.Name,
                        Picture = googleUser.Picture
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { Token = GenerateJWT(user) });
            }
            catch (Exception e)
            {
                logger.LogError(e.Message);
                return BadRequest();
            }
        }

        private string GenerateJWT(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("CiaYraHardcodintasINHRaktasNesNeraDidelesPrasmesJiKazkurSaugotKitur");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.NameIdentifier, user.Sub),
                    new Claim("picture", user.Picture ?? string.Empty)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User with ID {id} has been deleted" });
        }

    }
}
