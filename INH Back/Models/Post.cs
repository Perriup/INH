namespace INH_Back.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public int CategoryId { get; set; }

        public List<Comment> Comments { get; set; }

        public Post() 
        {
            PostId = 0;
            Title = "Default";
            Content = "Default";
            CategoryId = 0;
            Comments = new List<Comment>();
        }

        public Post(string title, string content, int categoryId)
        {
            PostId = 0;
            Title = title;
            Content = content;
            CategoryId = categoryId;
            Comments = new List<Comment>();
        }

        public Post(int postId, string title, string content, int categoryId)
        {
            PostId = postId;
            Title = title;
            Content = content;
            CategoryId = categoryId;
            Comments = new List<Comment>();
        }

        public Post(int postId, string title, string content, int categoryId, List<Comment> comments)
        {
            PostId = postId;
            Title = title;
            Content = content;
            CategoryId = categoryId;
            Comments = comments;
        }
    }
}
