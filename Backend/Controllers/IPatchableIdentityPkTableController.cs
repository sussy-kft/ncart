namespace Backend.Controllers
{
    public interface IPatchableIdentityPkTableController<TPatchFormat> : IPatchableTableController<int, TPatchFormat> where TPatchFormat : class
    {

    }
}
