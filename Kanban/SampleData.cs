using Kanban.Models;
using System;
using System.Linq;

namespace Kanban
{
    public static class SampleData
    {
        public static void Initialize(KanbanContext context)
        {
            if (!context.Tickets.Any())
            {
                context.Tickets.AddRange(
                new Ticket { Id = Guid.NewGuid().ToString(), Title = "Установить React", Description = "Необходим для проекта Kanban доски", Priority = 1 },                
                new Ticket { Id = Guid.NewGuid().ToString(), Title = "Дизайн классов Kanban", Description = "Разработать дизайн классов для тестового задания)))", Priority = 1 },
                new Ticket { Id = Guid.NewGuid().ToString(), Title = "База данных", Description = "Создать и проинициализировать базу данных", Priority = 2 },
                new Ticket { Id = Guid.NewGuid().ToString(), Title = "UI", Description = "Реализовать UI с использованием стека NET CORE MVC - React", Priority = 3 }
                );
                context.SaveChanges();
            }
        }
    }
}