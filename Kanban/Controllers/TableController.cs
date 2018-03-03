using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Kanban.Models;
using System.Collections.Generic;
using System;

namespace Kanban.Controllers
{
    public class TableController : Controller
    {
        KanbanContext db;

        public TableController(KanbanContext context)
        {
            db = context;
        }

        public IActionResult Index()
        {
            var tickets = db.Tickets.ToList();
            return View(tickets);
        }

        // Get tickets
        [Route("tickets")]
        public ActionResult Tickets(int? column)
        {
            List<Ticket> tickets;
            if (column == null)
            {
                tickets = db.Tickets.ToList();
            }
            else
            {
                tickets = db.Tickets.Where(t => t.Column == column).OrderBy(t => t.Priority).ToList();
            }
            return Json(tickets);
        }

        [Route("tickets/new")]
        [HttpPost]
        // public ActionResult AddTicket(Ticket ticket)
        public ActionResult AddTicket([FromBody]Ticket ticket)
        {
            ticket.Id = Guid.NewGuid().ToString();
            db.Tickets.Add(ticket);
            db.SaveChanges();
            return Content("Success :)");
        }

        [Route("tickets/edit")]
        [HttpPost]
        public ActionResult EditTicket(Ticket ticket)
        {
            var dbTicket = db.Tickets.FirstOrDefault(t => t.Id.Contains(ticket.Id));
            dbTicket.Title = ticket.Title;
            dbTicket.Description = ticket.Description;
            dbTicket.Priority = ticket.Priority;
            db.SaveChanges();
            return Content("Success :)");
        }

        // Delete ticket
        [Route("tickets/delete")]
        [HttpDelete]
        public ActionResult DeleteTicket(string id)
        {
            var ticket = db.Tickets.FirstOrDefault(t => t.Id.Contains(id));
            db.Tickets.Remove(ticket);
            db.SaveChanges();
            return Content("Success :)");
        }

        // Move ticket between columns
        [Route("tickets/move")]
        [HttpPost]
        public ActionResult Move(string id, int column)
        {
            var ticket = db.Tickets.FirstOrDefault(t => t.Id.Contains(id));
            if (ticket != null)
            {
                // ticket.Column = Int32.Parse(column);
                ticket.Column = column;
                db.SaveChanges();
                return Content("Success :)");
            }
            return Content(null);
        }

        // Move ticket between columns
        [Route("tickets/movetarget")]
        [HttpPost]
        public ActionResult MoveTarget(string id, string target)
        {
            var ticket = db.Tickets.FirstOrDefault(t => t.Id.Contains(id));
            if (ticket != null)
            {
                if (ticket.Column < 2 && target.Contains("next"))
                {
                    ticket.Column++;
                    db.SaveChanges();
                }
                else
                {
                    if (ticket.Column > 0 && target.Contains("prev"))
                    {
                        ticket.Column--;
                        db.SaveChanges();
                    }
                }
                return Content("Success :)");
            }
            return Content(null);
        }

        // Delete tickets priority
        [Route("tickets/prioritychange")]
        [HttpPost]
        public ActionResult PriorityChange(string id, string target)
        {
            var ticket = db.Tickets.FirstOrDefault(t => t.Id.Contains(id));
            if (ticket != null)
            {
                if (target.Contains("up"))
                {
                    ticket.Priority++;
                    db.SaveChanges();
                }
                else
                {
                    if (ticket.Priority > 0 && target.Contains("dn"))
                    {
                        ticket.Priority--;
                        db.SaveChanges();
                    }
                }
                return Content("Success :)");
            }
            return Content(null);
        }
    }
}
