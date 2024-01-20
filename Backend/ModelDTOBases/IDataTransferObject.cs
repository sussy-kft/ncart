namespace Backend.ModelDTOBases
{
    public interface IDataTransferObject<TModel> where TModel : class
    {
        TModel ToDbModel();
    }
}
