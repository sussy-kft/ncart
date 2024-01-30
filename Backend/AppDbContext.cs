using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class AppDbContext : DbContext
    {
        IConfiguration config;

        public DbSet<Kezelo> Kezelok { get; set; }
        public DbSet<JarmuTipus> JarmuTipusok { get; set; }
        public DbSet<Allomas> Allomasok { get; set; }
        public DbSet<Vonal> Vonalak { get; set; }
        public DbSet<Inditas> Inditasok { get; set; }
        public DbSet<Megall> Megallok { get; set; }

        public AppDbContext(IConfiguration config)
        {
            this.config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(config.GetConnectionString("DbConnection"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JarmuTipus>()
                .HasMany(jarmuTipus => jarmuTipus._Vonalak)
                .WithOne(vonal => vonal._JarmuTipus)
                .HasForeignKey(vonal => vonal.JarmuTipus)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._VonalakKezdoAll)
                .WithOne(vonal => vonal._KezdoAll)
                .HasForeignKey(vonal => vonal.KezdoAll)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._VonalakVegall)
                .WithOne(vonal => vonal._Vegall)
                .HasForeignKey(vonal => vonal.Vegall)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._Megallok)
                .WithOne(megall => megall._Allomas)
                .HasForeignKey(megall => megall.Allomas)
            ;
            modelBuilder.Entity<Vonal>()
                .HasMany(vonal => vonal._Inditasok)
                .WithOne(inditas => inditas._Vonal)
                .HasForeignKey(inditas => inditas.Vonal)
            ;
            modelBuilder.Entity<Vonal>()
                .HasMany(vonal => vonal._Megallok)
                .WithOne(megall => megall._Vonal)
                .HasForeignKey(megall => megall.Vonal)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._ElozoMegallok)
                .WithOne(megall => megall._ElozoMegallo)
                .HasForeignKey(megall => megall.ElozoMegallo)
            ;
            modelBuilder.Entity<Inditas>()
                .ToTable(tableBuilder => {
                    tableBuilder.HasCheckConstraint($"CK_Inditasok_{nameof(Inditas.Nap)}_Between", $"{nameof(Inditas.Nap)} >= 1 AND {nameof(Inditas.Nap)} <= 8");
                })
            ;
            modelBuilder.Entity<Inditas>()
                .ToTable(tableBuilder => {
                    tableBuilder.HasCheckConstraint($"CK_Inditasok_{nameof(Inditas.InditasIdeje)}_Between", $"{nameof(Inditas.InditasIdeje)} >= 0 AND {nameof(Inditas.InditasIdeje)} < 1440");
                })
            ;
        }
    }
}
