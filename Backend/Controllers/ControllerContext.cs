using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext(AppDbContext context, IConfiguration config) : ControllerBase()
    {
        protected AppDbContext context { get; } = context;
        protected IConfiguration config { get; } = config;
    }
}
