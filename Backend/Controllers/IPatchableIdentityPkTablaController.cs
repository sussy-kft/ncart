namespace Backend.Controllers
{
    public interface IPatchableIdentityPkTablaController<TPatchFormat> : IPatchableTablaController<int, TPatchFormat> where TPatchFormat : class
    {

    }
}
