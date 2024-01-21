namespace Backend.ModelDTOBases
{
    public interface IConvertible<T> where T : class
    {
        T ConvertType();
    }
}
