function Bejelentkezes()
{
    return (
        <form onSubmit={event => {
            event.preventDefault();
        }}>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" placeholder="sussybaki@amogus.sus" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" />
            </div>
            <input type="submit" value="Bejelentkezés" />
        </form>
    );
}

export default Bejelentkezes;