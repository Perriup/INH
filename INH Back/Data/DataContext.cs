using INH_Back.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace INH_Back.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .Property(c => c.CategoryId)
                .ValueGeneratedNever();

            modelBuilder.Entity<Category>()
                .HasKey(c => c.CategoryId);

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, Name = "Category 1" },
                new Category { CategoryId = 2, Name = "Category 2" },
                new Category { CategoryId = 3, Name = "Category 3" }
            );

            modelBuilder.Entity<Post>()
                .Property(p => p.PostId)
                .ValueGeneratedNever();

            modelBuilder.Entity<Post>()
                .HasKey(p => new { p.CategoryId, p.PostId });

            modelBuilder.Entity<Post>().HasData(
                new Post { PostId = 1, Title = "Post 1", Content = "Content 1", CategoryId = 1 },
                new Post { PostId = 2, Title = "Post 2", Content = "Content 2", CategoryId = 2 },
                new Post { PostId = 3, Title = "Post 3", Content = "Content 3", CategoryId = 3 }
            );

            modelBuilder.Entity<Comment>()
                .Property(c => c.CommentId)
                .ValueGeneratedNever();

            modelBuilder.Entity<Comment>()
                .HasKey(c => new { c.CategoryId, c.PostId, c.CommentId });

            modelBuilder.Entity<Comment>().HasData(
                new Comment { CommentId = 1, Text = "Comment 1", PostId = 1, CategoryId = 1 },
                new Comment { CommentId = 2, Text = "Comment 2", PostId = 2, CategoryId = 2 },
                new Comment { CommentId = 3, Text = "Comment 3", PostId = 3, CategoryId = 3 }
            );

            modelBuilder.Entity<User>()
                .Property(u => u.Sub)
                .ValueGeneratedNever();
            modelBuilder.Entity<User>()
                .HasKey(u => u.Sub);
            modelBuilder.Entity<User>().HasData(
                new User { Sub = "1", Name = "User 1", Email = "zymantas.petreikis@gmail.com", Role = "Admin" }
            );
        }
    }
}
