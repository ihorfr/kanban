namespace Kanban.Models
{
    public class Ticket
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }               // ограничить положительными
        public int Column { get; set; }                 // ограничить 0, 1, 2
    }
}
