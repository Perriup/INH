namespace INH_Back.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }

        public List<Post> Posts { get; set; }

        public Category() 
        { 
            CategoryId = 0;
            Name = "Default";
            Posts = new List<Post>();
        }

        public Category(string name)
        {
            CategoryId = 0;
            Name = name;
            Posts = new List<Post>();
        }

        public Category(int categoryId, string name)
        {
            CategoryId = categoryId;
            Name = name;
            Posts = new List<Post>();
        }
    }
}
