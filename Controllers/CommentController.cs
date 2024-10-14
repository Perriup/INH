namespace INH_Back.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using INH_Back.Data;
    using INH_Back.Models;

    [Route("category/{categoryId}/post/{postId}/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly DataContext _context;

        public CommentController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments(int categoryId, int postId)
        {
            var post = await _context.Posts.Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == postId);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post.Comments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(int categoryId, int postId, int id)
        {
            var reqPost = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == postId);

            if (reqPost == null)
            {
                return NotFound();
            }

            var comment = reqPost.Comments.FirstOrDefault(c => c.CommentId == id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int categoryId, int postId, int id, Comment comment)
        {
            var reqPost = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == postId);

            if (reqPost == null)
            {
                return BadRequest();
            }

            var commentToUpdate = reqPost.Comments.FirstOrDefault(c => c.CommentId == id);

            if (commentToUpdate != null)
            {
                _context.Comments.Remove(commentToUpdate);
            }

            comment.CommentId = id;

            comment.PostId = postId;

            comment.CategoryId = categoryId;

            _context.Comments.Add(comment);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> PostComment(int categoryId, int postId, Comment comment)
        {
            if (comment.PostId < 0)
            {
                return BadRequest();
            }

            var post = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == postId);

            if (post == null)
            {
                return BadRequest();
            }

            comment.CommentId = post.Comments.Count + 1;

            comment.PostId = postId;

            comment.CategoryId = categoryId;

            post.Comments.Add(comment);

            _context.Comments.Add(comment);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetComment),
                    new { categoryId = categoryId, postId = postId, id = comment.CommentId }, comment);
            }
            else
            {
                return BadRequest();
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int categoryId, int postId, int id)
        {
            var post = await _context.Posts.Include(p => p.Comments).FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == postId);

            if (post == null)
            {
                return NotFound();
            }

            var comment = post.Comments.FirstOrDefault(c => c.CommentId == id);

            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.CommentId == id);
        }

    }
}
