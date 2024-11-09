namespace INH_Back.Models
{
    public class User
    {
        //the only way to login is using google OAut2

        public string Sub { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public List<Post> Posts { get; set; }
        public User() { }
        public User(string sub, string email, string name, string picture, string role)
        {
            Sub = sub;
            Email = email;
            Name = name;
            if (role == null)
            {
                Role = "User";
            }
            else
            {
                Role = role;
            }
            Posts = new List<Post>();
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
            User user = (User)obj;
            return Sub == user.Sub && Email == user.Email && Name == user.Name && Role == user.Role;
        }

        public override int GetHashCode()
        {
            return Email.GetHashCode();
        }

        public void Update(User user)
        {
            Sub = user.Sub;
            Email = user.Email;
            Name = user.Name;
            Role = user.Role;
        }

        public void Update(string guid, string email, string name, string picture, string role)
        {
            Sub = guid;
            Email = email;
            Name = name;
            Role = role;
        }

        public void UpdateName(string name)
        {
            Name = name;
        }

        public void UpdateRole(string role)
        {
            Role = role;
        }

    }
}
