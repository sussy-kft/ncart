namespace Backend.Controllers
{
    public abstract class ControllerContext(AppDbContext context) : JsonRecieverController()
    {
        protected AppDbContext context { get; } = context;
    }
}
