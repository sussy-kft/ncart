using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend
{
    public class AppDbContext(IConfiguration config) : DbContext
    {
        IConfiguration config { get; } = config;

        public DbSet<Kezelo> Kezelok { get; set; }
        public DbSet<JarmuTipus> JarmuTipusok { get; set; }
        public DbSet<Allomas> Allomasok { get; set; }
        public DbSet<Vonal> Vonalak { get; set; }
        public DbSet<Inditas> Inditasok { get; set; }
        public DbSet<Megall> Megallok { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseSqlServer(config.GetConnectionString("DbConnection"))
                //.LogTo(message => System.Diagnostics.Debug.WriteLine(message))
            ;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JarmuTipus>()
                .HasMany(jarmuTipus => jarmuTipus._Vonalak)
                .WithOne(vonal => vonal._JarmuTipus)
                .HasForeignKey(vonal => vonal.JarmuTipus)
                .OnDelete(DeleteBehavior.Restrict)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._VonalakKezdoAll)
                .WithOne(vonal => vonal._KezdoAll)
                .HasForeignKey(vonal => vonal.KezdoAll)
                .OnDelete(DeleteBehavior.Restrict)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._VonalakVegall)
                .WithOne(vonal => vonal._Vegall)
                .HasForeignKey(vonal => vonal.Vegall)
                .OnDelete(DeleteBehavior.Restrict)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._Megallok)
                .WithOne(megall => megall._Allomas)
                .HasForeignKey(megall => megall.Allomas)
                .OnDelete(DeleteBehavior.Restrict)
            ;
            modelBuilder.Entity<Vonal>()
                .HasMany(vonal => vonal._Inditasok)
                .WithOne(inditas => inditas._Vonal)
                .HasForeignKey(inditas => inditas.Vonal)
                .OnDelete(DeleteBehavior.Cascade)
            ;
            modelBuilder.Entity<Vonal>()
                .HasMany(vonal => vonal._Megallok)
                .WithOne(megall => megall._Vonal)
                .HasForeignKey(megall => megall.Vonal)
                .OnDelete(DeleteBehavior.Restrict)
            ;
            modelBuilder.Entity<Allomas>()
                .HasMany(allomas => allomas._ElozoMegallok)
                .WithOne(megall => megall._ElozoMegallo)
                .HasForeignKey(megall => megall.ElozoMegallo)
                .OnDelete(DeleteBehavior.Restrict)
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
            modelBuilder.Entity<Vonal>()
                .ToTable(tableBuilder => {
                    tableBuilder.HasCheckConstraint($"CK_Vonalak_{nameof(Vonal.KezdoAll)}_Es_{nameof(Vonal.Vegall)}_Nem_Egegyeznek", $"{nameof(Vonal.KezdoAll)} <> {nameof(Vonal.Vegall)}");
                    tableBuilder.HasTrigger("Uj_Vonal_Vegallomas");
                    tableBuilder.HasTrigger("Vonalak_Cascade");
                })
            ;
            modelBuilder.Entity<Megall>()
                .ToTable(tableBuilder => {
                    tableBuilder.HasTrigger("Kezdo_All_Megvaltozott");
                    tableBuilder.HasTrigger("Megallo_Beszur");
                    tableBuilder.HasTrigger("Megallo_Torol");
                    tableBuilder.HasTrigger("Vonal_Bovitve");
                    tableBuilder.HasTrigger("Vonal_Roviditve");
                })
            ;
        }
    }
}
