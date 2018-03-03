using System.Collections.Generic;
using System.Linq;

namespace Kanban.Models
{
    public class Table
    {
        public const int ColumnCount = 3;

        public IList<Ticket> TicketList { get; set; }

        public void ToDo(string id)
        {
            Ticket ticket = TicketList.FirstOrDefault(x => x.Id == id);
            ticket.Column = 0;
        }

        public void MoveToNextColumn(string id)
        {
            Ticket ticket = TicketList.FirstOrDefault(x => x.Id == id);
            if (ticket.Column < ColumnCount - 1)
            {
                ticket.Column++;
            }
        }

        public void MoveToPrevColumn(string id)
        {
            Ticket ticket = TicketList.FirstOrDefault(x => x.Id == id);
            if (ticket.Column > 0 )
            {
                ticket.Column--;
            }
        }
    }
}
