class Ticket extends React.Component {
    constructor(props) {
        super(props);
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);

        this.state = {
            priority: this.props.ticket.priority,
            title: this.props.ticket.title,
            description: this.props.ticket.description,
            column: this.props.ticket.column,
            classDivEdit: "div-none",
            classDivView: ""
        }
    }

    handlePriorityChange = (event) => {
        if (event.target.value >= 0) {
            this.setState({ priority: event.target.value });
        }
    };

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value });
    };

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    };

    handleEditSubmit = () => {
        var data = new FormData();
        data.append('id', this.props.ticket.id);
        data.append('title', this.state.title.trim());
        data.append('description', this.state.description.trim());
        data.append('column', this.props.ticket.column);
        data.append('priority', this.state.priority);
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/tickets/edit', true);
        xhr.send(data);
        this.setState({ classDivEdit: "div-none" });
        this.setState({ classDivView: "" });
    };

    next() {
        var col = this.state.column;
        if (col < 2) {
            col++;
        }
        this.moveToServer(col, 1);
    }

    prev() {
        var col = this.state.column;
        if (col > 0) {
            col--;
        }
        this.moveToServer(col, 0);
    }

    moveToServer(col, code) {
        var item = this.props.ticket;
        item.column = col;
        var data = new FormData();
        data.append('id', item.id);
        data.append('column', item.column);
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/tickets/move', true);
        xhr.send(data);
        this.props.onChangeTicket(item, code);   // вызываем обработчик родителя, передавая ему параметры
    }

    delete() {
        var data = new FormData();
        data.append('id', this.props.ticket.id);
        var xhr = new XMLHttpRequest();
        xhr.open('delete', '/tickets/delete', true);
        xhr.send(data);
        this.props.onChangeTicket(this.props.ticket, 3);
    }

    edit() {
        this.setState({ classDivEdit: "" });
        this.setState({ classDivView: "div-none" });
    }

    render() {
        var labelClass;
        var cardClass = "kanban-card kanban-card-default"
        var buttonClass = "btn-default"

        if (this.state.priority == 0) {
            labelClass = "label label-danger"
        }
        else {
            labelClass = "label label-default"
        }

        if (this.props.ticket.column === 1) {
            cardClass = "kanban-card kanban-card-primary "
            buttonClass = "btn-primary"
        }
        else
            if (this.props.ticket.column === 2) {
                var cardClass = "kanban-card kanban-card-success "
                buttonClass = "btn-success"
            }

        return <div>
            <div className={cardClass + " " + this.state.classDivView} >
                <div className="row">
                    <h3 className="card-title">{this.state.title}</h3>

                    <h5 className="card-desc">
                        <div>{this.state.description}</div>
                    </h5>

                    <div className="row">
                        <div className="col col-lg-3 col-xl-3 col-md-3 col-sm-3 card-button">
                            <span className={labelClass}> Priority: {this.state.priority}</span>&nbsp;
                        </div>

                        <div className="col card-button div-right">
                            <button className={"btn btn-sm " + buttonClass} onClick={this.prev}>Prev</button>&nbsp;
                            <button className={"btn btn-sm " + buttonClass} onClick={this.next}>Next</button>&nbsp;
                            <button className={"btn btn-sm " + buttonClass} onClick={this.edit}>Edit</button>&nbsp;
                            <button className={"btn btn-sm " + buttonClass} onClick={this.delete}>Delete</button>
                        </div>

                    </div>
                </div>
            </div>

            <div className={cardClass + " " + this.state.classDivEdit}>
                <div className="row">
                    <div>
                        <div className="row">
                            <input className={"col-lg-11 kanban-input "}
                                type="text"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>

                        <div className="row">
                            <input className="col-lg-11 kanban-input"
                                type="number"
                                value={this.state.priority}
                                onChange={this.handlePriorityChange} />
                        </div>

                        <div className="row">
                            <textarea className="col-lg-11 kanban-input"
                                type="text"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange} />
                        </div>

                        <div className="col card-button div-right">
                            <button className={"btn btn-sm " + buttonClass} onClick={this.handleEditSubmit}>Ok</button>&nbsp;
                        </div>
                    </div>
                </div>
            </div>
        </div>

    }
}

var TicketsList = React.createClass({
    handleUpdateTicket: function (index, item, code) {
        this.props.onChangeTicketList(item, code);
    },

    render: function () {
        return (
            <div>
                {this.props.list.map(function (item, i) {
                    return (
                        <Ticket onChangeTicket={this.handleUpdateTicket.bind(this, i)} key={item.id} ticket={item} ref={'item' + i} />
                    );
                }, this)}
            </div>
        );
    }
});


class KanbanTableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tickets: [] };

        this.onAddTicket = this.onAddTicket.bind(this);
        this.handleUpdateTickets = this.handleUpdateTickets.bind(this);
    }

    // загрузка данных
    loadTicketsFromServer() {
        var xhr = new XMLHttpRequest();
        var url = "/tickets";
        xhr.open('get', url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ tickets: data });
        }.bind(this);
        xhr.send();
    }

    componentDidMount() {
        this.loadTicketsFromServer();
    }

    // обработчик - добавление объекта
    onAddTicket = (ticket) => {
        if (ticket) {

            var data = JSON.stringify({
                'title': ticket.title, 'description': ticket.description,
                'column': ticket.column, 'priority': ticket.priority
            });

            var xhr = new XMLHttpRequest();
            xhr.open('post', '/tickets/new', true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onload = function () {
                if (xhr.status == 200) {
                    this.loadTicketsFromServer();
                }
            }.bind(this);
            xhr.send(data);
        }
    }

    // обработчик prev, next, delete
    handleUpdateTickets = (item, code) => {
        let el = this.getById(this.state.tickets, item.id);
        let ind = this.state.tickets.indexOf(el);

        if (code == 0 || code == 1) {
            el.column = item.column;
            this.state.tickets[ind] = el;
        }
        else
            if (code == 3) {
                this.state.tickets.splice(ind, 1);                         // удалить один элемент
            }

        this.forceUpdate();
    };

    componentDidMount() {
        this.loadTicketsFromServer();
    }

    filterBy(column) {
        return this.state.tickets.filter(item => { return item.column === column }).sort(t => t.priority);
    }

    getById(arr, value) {
        var result = arr.filter(function (o) { return o.id == value; });
        return result ? result[0] : null;
    }

    render() {
        return (
            <div>
                <div className="H1 bg-info" >
                    Kanban Table
                </div>
                <table className="col-lg-12">
                    <thead>
                        <tr>
                            <th className="col-lg-4 col-xl-4 col-md-4 col-sm-4"><div className="kanban-card kanban-card-default">TO DO:</div> </th>
                            <th className="col-lg-4 col-xl-4 col-md-4 col-sm-4"><div className="kanban-card kanban-card-primary">In progress:</div></th>
                            <th className="col-lg-4 col-xl-4 col-md-4 col-sm-4"><div className="kanban-card kanban-card-success">Done:</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="div-top"><TicketsList onChangeTicketList={this.handleUpdateTickets} list={this.filterBy(0)} /></td>
                            <td className="div-top"><TicketsList onChangeTicketList={this.handleUpdateTickets} list={this.filterBy(1)} /></td>
                            <td className="div-top"><TicketsList onChangeTicketList={this.handleUpdateTickets} list={this.filterBy(2)} /></td>
                        </tr>
                    </tbody>
                </table>
                <AddBox className="col-lg-3" onAddTicket={this.onAddTicket} />
            </div>
        );
    }
}

var AddBox = React.createClass({
    getInitialState: function () {
        return {
            showReply: false,
            postLink: "New Task"
        };
    },

    addTicket: function (ticket) {
        this.props.onAddTicket(ticket);
    },

    onClick(e) {
        e.preventDefault();
        this.setState({ showReply: !this.state.showReply });
        if (this.state.showReply)
            this.setState({ postLink: "New Task" })
        else
            this.setState({ postLink: "Hide" })
    },

    render() {
        return (
            <div>
                <a onClick={this.onClick} href='#'>{this.state.postLink}</a>
                {this.state.showReply && <AddTicketForm className="col-lg-3" onAddTicket={this.addTicket} />}
            </div>
        )
    }
});


var AddTicketForm = React.createClass({
    getInitialState: function () {
        return { title: '', description: '', priority: '' };
    },
    handleTitleChange: function (e) {
        this.setState({ title: e.target.value });
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    handlePriorityChange: function (e) {
        this.setState({ priority: e.target.value });
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var title = this.state.title.trim();
        var description = this.state.description.trim();
        var column = '0';
        var id = this.guid();
        var priority = this.state.priority;

        if (!title || !description) {
            return;
        }

        var data = new FormData();
        this.props.onAddTicket({ id: id, title: title, description: description, column: column, priority: priority });

        this.setState({ title: '', description: '', priority: '' });
    },

    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },

    render: function () {
        return (
            <div>
                <form className="ticketForm" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <input className="col-lg-4 col-xl-4 col-md-4 col-sm-4 kanban-input"
                            type="text"
                            placeholder="Title"
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />
                    </div>
                    <div className="row">
                        <textarea className="col-lg-4 col-xl-4 col-md-4 col-sm-4 kanban-input "
                            type="text"
                            placeholder="Description"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange} />
                    </div>
                    <div className="row">
                        <input className="col-lg-4 col-xl-4 col-md-4 col-sm-4 kanban-input"
                            type="number"
                            placeholder="Priority"
                            value={this.state.priority}
                            onChange={this.handlePriorityChange} />
                    </div>
                    <div>
                        <input type="submit" className="btn btn-sm btn-primary " value="Add Ticket" />
                    </div>
                </form>
            </div>
        );
    }
});

ReactDOM.render(
    <KanbanTableComponent />,
    document.getElementById('content')
);