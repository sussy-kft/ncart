using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext(AppDbContext context) : ControllerBase()
    {
        protected AppDbContext context { get; } = context;
    }
}
