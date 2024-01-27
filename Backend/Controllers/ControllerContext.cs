using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    public abstract class ControllerContext : ControllerBase
    {
        protected AppDbContext context { get; }

        protected ControllerContext(AppDbContext context) : base()
        {
            this.context = context;
        }
    }
}
