﻿// <auto-generated />
using Backend;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Allomas", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<long>("Koord")
                        .HasColumnType("bigint");

                    b.Property<string>("Nev")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.HasKey("Id");

                    b.ToTable("Allomasok");
                });

            modelBuilder.Entity("Backend.Models.Inditas", b =>
                {
                    b.Property<int>("Vonal")
                        .HasColumnType("int");

                    b.Property<byte>("Nap")
                        .HasColumnType("tinyint");

                    b.Property<short>("InditasIdeje")
                        .HasColumnType("smallint");

                    b.HasKey("Vonal", "Nap", "InditasIdeje");

                    b.ToTable("Inditasok", t =>
                        {
                            t.HasCheckConstraint("CK_Inditasok_InditasIdeje_Between", "InditasIdeje >= 0 AND InditasIdeje < 1440");

                            t.HasCheckConstraint("CK_Inditasok_Nap_Between", "Nap >= 1 AND Nap <= 8");
                        });
                });

            modelBuilder.Entity("Backend.Models.JarmuTipus", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Megnevezes")
                        .IsRequired()
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)");

                    b.HasKey("Id");

                    b.ToTable("JarmuTipusok");
                });

            modelBuilder.Entity("Backend.Models.Kezelo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<byte>("Engedelyek")
                        .HasColumnType("tinyint");

                    b.Property<string>("Jelszo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Kezelok");
                });

            modelBuilder.Entity("Backend.Models.Megall", b =>
                {
                    b.Property<int>("Vonal")
                        .HasColumnType("int");

                    b.Property<int>("Allomas")
                        .HasColumnType("int");

                    b.Property<int>("ElozoMegallo")
                        .HasColumnType("int");

                    b.Property<byte>("HanyPerc")
                        .HasColumnType("tinyint");

                    b.HasKey("Vonal", "Allomas");

                    b.HasIndex("Allomas");

                    b.HasIndex("ElozoMegallo");

                    b.ToTable("Megallok");
                });

            modelBuilder.Entity("Backend.Models.Vonal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("JarmuTipus")
                        .HasColumnType("int");

                    b.Property<int>("KezdoAll")
                        .HasColumnType("int");

                    b.Property<int>("Vegall")
                        .HasColumnType("int");

                    b.Property<string>("VonalSzam")
                        .IsRequired()
                        .HasMaxLength(4)
                        .HasColumnType("nvarchar(4)");

                    b.HasKey("Id");

                    b.HasIndex("JarmuTipus");

                    b.HasIndex("KezdoAll");

                    b.HasIndex("Vegall");

                    b.ToTable("Vonalak", t =>
                        {
                            t.HasCheckConstraint("CK_Vonalak_KezdoAll_Es_Vegall_Nem_Egegyeznek", "KezdoAll <> Vegall");
                        });
                });

            modelBuilder.Entity("Backend.Models.Inditas", b =>
                {
                    b.HasOne("Backend.Models.Vonal", "_Vonal")
                        .WithMany("_Inditasok")
                        .HasForeignKey("Vonal")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("_Vonal");
                });

            modelBuilder.Entity("Backend.Models.Megall", b =>
                {
                    b.HasOne("Backend.Models.Allomas", "_Allomas")
                        .WithMany("_Megallok")
                        .HasForeignKey("Allomas")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Allomas", "_ElozoMegallo")
                        .WithMany("_ElozoMegallok")
                        .HasForeignKey("ElozoMegallo")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Vonal", "_Vonal")
                        .WithMany("_Megallok")
                        .HasForeignKey("Vonal")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("_Allomas");

                    b.Navigation("_ElozoMegallo");

                    b.Navigation("_Vonal");
                });

            modelBuilder.Entity("Backend.Models.Vonal", b =>
                {
                    b.HasOne("Backend.Models.JarmuTipus", "_JarmuTipus")
                        .WithMany("_Vonalak")
                        .HasForeignKey("JarmuTipus")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Allomas", "_KezdoAll")
                        .WithMany("_VonalakKezdoAll")
                        .HasForeignKey("KezdoAll")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Allomas", "_Vegall")
                        .WithMany("_VonalakVegall")
                        .HasForeignKey("Vegall")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("_JarmuTipus");

                    b.Navigation("_KezdoAll");

                    b.Navigation("_Vegall");
                });

            modelBuilder.Entity("Backend.Models.Allomas", b =>
                {
                    b.Navigation("_ElozoMegallok");

                    b.Navigation("_Megallok");

                    b.Navigation("_VonalakKezdoAll");

                    b.Navigation("_VonalakVegall");
                });

            modelBuilder.Entity("Backend.Models.JarmuTipus", b =>
                {
                    b.Navigation("_Vonalak");
                });

            modelBuilder.Entity("Backend.Models.Vonal", b =>
                {
                    b.Navigation("_Inditasok");

                    b.Navigation("_Megallok");
                });
#pragma warning restore 612, 618
        }
    }
}
