namespace INH_Back.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using INH_Back.Data;
    using INH_Back.Models;

    [Route("category/{categoryId}/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly DataContext _context;

        public PostController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts(int categoryId)
        {
            var category = await _context.Categories.Include(c => c.Posts).ThenInclude(p => p.Comments).FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category.Posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int categoryId, int id)
        {
            var post = await _context.Posts.Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.CategoryId == categoryId && p.PostId == id);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPost(int categoryId, int id, Post post)
        {
            var category = await _context.Categories.FindAsync(categoryId);

            if (category == null)
            {
                return BadRequest();
            }

            var postToUpdate = await _context.Posts.FirstOrDefaultAsync(p => p.PostId == id && p.CategoryId == categoryId);

            if (postToUpdate != null)
            {
                _context.Posts.Remove(postToUpdate);

                var categoryToUpdate = await _context.Categories.FindAsync(postToUpdate.CategoryId);

                if (categoryToUpdate != null)
                {
                    categoryToUpdate.Posts.Where(p => p.PostId == id).ToList().ForEach(p => categoryToUpdate.Posts.Remove(p));
                }
            }

            post.CategoryId = categoryId;

            post.PostId = id;

            _context.Posts.Add(post);

            category.Posts.Add(post);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
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
        public async Task<ActionResult<Post>> PostPost(int categoryId, Post post)
        {
            if (categoryId < 0)
            {
                return BadRequest();
            }

            var category = await _context.Categories.Include(c => c.Posts).FirstOrDefaultAsync(c => c.CategoryId == categoryId);
            if (category == null)
            {
                return BadRequest();
            }

            post.PostId = category.Posts.Count + 1;

            post.CategoryId = categoryId;

            category.Posts.Add(post);

            _context.Posts.Add(post);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction(nameof(GetPost), new { categoryId = categoryId, id = post.PostId }, post);
            }
            else
            {
                return StatusCode(500, "Could not save post");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int categoryId, int id)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.PostId == id && p.CategoryId == categoryId);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.PostId == id);
        }
    }
}
