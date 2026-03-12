using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class BaseController : ControllerBase
    {
        protected string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
        protected string UserRole => User.FindFirstValue(ClaimTypes.Role) ?? "";

        protected int CurrentProfileId
        {
            get
            {
                var idClaim = User.FindFirstValue("ProfileId");
                return int.TryParse(idClaim, out int id) ? id : 0;
            }
        }
    }
}