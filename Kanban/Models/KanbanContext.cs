using Microsoft.EntityFrameworkCore;

namespace Kanban.Models
{
    public class KanbanContext : DbContext
    {
        public DbSet<Ticket> Tickets { get; set; }

        public KanbanContext(DbContextOptions<KanbanContext> options)
    : base(options)
        { }        
    }
}
