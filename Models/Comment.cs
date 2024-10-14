namespace INH_Back.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string Text { get; set; }

        public int PostId { get; set; }
        public int CategoryId { get; set; }

        public Comment() 
        { 
            CommentId = 0;
            Text = "Default";
            PostId = 0;
            CategoryId = 0;
        }

        public Comment(string text, int postId)
        {
            CommentId = 0;
            Text = text;
            PostId = postId;
            CategoryId = 0;
        }

        public Comment(int commentId, string text, int postId)
        {
            CommentId = commentId;
            Text = text;
            PostId = postId;
            CategoryId = 0;
        }
    }
}
