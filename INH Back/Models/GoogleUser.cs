namespace INH_Back.Models
{
    public class GoogleUser
    {
        public string Sub { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public string Picture { get; set; }
        public List<Post> Posts { get; set; }
        public GoogleUser() { }
        public GoogleUser(string sub, string email, string name, string role, string picture)
        {
            Sub = sub;
            Email = email;
            Name = name;
            Role = role;
            Posts = new List<Post>();
            Picture = picture;
        }
        public override string ToString()
        {
            return $"User: {Name}, Email: {Email}";
        }
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }
            GoogleUser user = (GoogleUser)obj;
            return Sub == user.Sub && Email == user.Email && Name == user.Name && Role == user.Role;
        }

        public override int GetHashCode()
        {
            return Email.GetHashCode();
        }

        public void Update(GoogleUser user)
        {
            Sub = user.Sub;
            Email = user.Email;
            Name = user.Name;
            Role = user.Role;
        }

        public void Update(string guid, string email, string name, string role, string picture)
        {
            Sub = guid;
            Email = email;
            Name = name;
            Role = role;
            Picture = picture;
        }

        public void UpdateName(string name)
        {
            Name = name;
        }
    }
}
