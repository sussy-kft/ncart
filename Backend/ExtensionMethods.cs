namespace Backend
{
    public static class ExtensionMethods
    {
        public static bool SelectFirst<T>(this IEnumerable<T> collection, out T? value, Func<T, bool> predicate)
        {
            IReadOnlyList<T> values = collection.ToList();
            int i = 0;
            while (i < values.Count && !predicate(values[i]))
            {
                i++;
            }
            bool found = i < values.Count;
            value = found ? values[i] : default;
            return found;
        }
    }
}
