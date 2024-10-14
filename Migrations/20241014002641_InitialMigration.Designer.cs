﻿// <auto-generated />
using INH_Back.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace INH_Back.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20241014002641_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.35")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("INH_Back.Models.Category", b =>
                {
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            CategoryId = 1,
                            Name = "Category 1"
                        },
                        new
                        {
                            CategoryId = 2,
                            Name = "Category 2"
                        },
                        new
                        {
                            CategoryId = 3,
                            Name = "Category 3"
                        });
                });

            modelBuilder.Entity("INH_Back.Models.Comment", b =>
                {
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("CommentId")
                        .HasColumnType("int");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CategoryId", "PostId", "CommentId");

                    b.ToTable("Comments");

                    b.HasData(
                        new
                        {
                            CategoryId = 1,
                            PostId = 1,
                            CommentId = 1,
                            Text = "Comment 1"
                        },
                        new
                        {
                            CategoryId = 2,
                            PostId = 2,
                            CommentId = 2,
                            Text = "Comment 2"
                        },
                        new
                        {
                            CategoryId = 3,
                            PostId = 3,
                            CommentId = 3,
                            Text = "Comment 3"
                        });
                });

            modelBuilder.Entity("INH_Back.Models.Post", b =>
                {
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CategoryId", "PostId");

                    b.ToTable("Posts");

                    b.HasData(
                        new
                        {
                            CategoryId = 1,
                            PostId = 1,
                            Content = "Content 1",
                            Title = "Post 1"
                        },
                        new
                        {
                            CategoryId = 2,
                            PostId = 2,
                            Content = "Content 2",
                            Title = "Post 2"
                        },
                        new
                        {
                            CategoryId = 3,
                            PostId = 3,
                            Content = "Content 3",
                            Title = "Post 3"
                        });
                });

            modelBuilder.Entity("INH_Back.Models.Comment", b =>
                {
                    b.HasOne("INH_Back.Models.Post", null)
                        .WithMany("Comments")
                        .HasForeignKey("CategoryId", "PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("INH_Back.Models.Post", b =>
                {
                    b.HasOne("INH_Back.Models.Category", null)
                        .WithMany("Posts")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("INH_Back.Models.Category", b =>
                {
                    b.Navigation("Posts");
                });

            modelBuilder.Entity("INH_Back.Models.Post", b =>
                {
                    b.Navigation("Comments");
                });
#pragma warning restore 612, 618
        }
    }
}
