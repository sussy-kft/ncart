namespace Backend
{
    public static class ProgramozasiTetelek
    {
        public static T Kivalaszt<T>(this IEnumerable<T> ertekek, Func<T, bool> feltetel)
        {
            int length = ertekek.Count();
            IReadOnlyList<T> values = ertekek.ToList();
            int i = 0;
            while (i < length && !feltetel(values[i]))
            {
                i++;
            }
            try
            {
                return values[i];
            }
            catch (IndexOutOfRangeException e)
            {
                throw new IndexOutOfRangeException(e.InnerException?.Message);
            }
        }
    }
}
