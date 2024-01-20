namespace Backend.ModelDTOBases
{
    public interface IDbModel<TDTO> where TDTO : class
    {
        TDTO ToDTO();
    }
}
