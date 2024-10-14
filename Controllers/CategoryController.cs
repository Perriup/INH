namespace INH_Back.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using INH_Back.Data;
    using INH_Back.Models;

    [Route("[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DataContext _context;

        public CategoryController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.Include(c => c.Posts).ThenInclude(p => p.Comments).ToListAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories.Include(c => c.Posts).ThenInclude(p => p.Comments).FirstOrDefaultAsync(c => c.CategoryId == id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            var categoryToUpdate = await _context.Categories.FindAsync(id);

            if (categoryToUpdate != null)
            {
                _context.Categories.Remove(categoryToUpdate);
            }

            category.CategoryId = id;

            _context.Categories.Add(category);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> PostCategory(Category category)
        {
            var checkIfThereAreCategories = _context.Categories.Count();

            if (checkIfThereAreCategories == 0)
            {
                category.CategoryId = 1;
            }
            else
            {
                var biggestId = _context.Categories.Max(c => c.CategoryId);
                category.CategoryId = biggestId + 1;
            }

            _context.Categories.Add(category);

            var result = await _context.SaveChangesAsync();


            // Check the result
            if (result > 0)
            {
                return CreatedAtAction("GetCategory", new { id = category.CategoryId }, category);
            }
            else
            {
                return StatusCode(500, "Could not save category");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.CategoryId == id);
        }
    }
}
