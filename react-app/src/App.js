import React, {Component} from 'react';

const USERS_URL = 'https://reqres.in/api/users';


export default class pagination extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            each_page: 10,
            current_page: 0,
            last_page: 0,
            total: 0
        };
    }

    componentDidMount() {
        this.changePage(0)
    }

    firstPage() {
        this.setState({current_page: 0});
        this.changePage(0)
    }

    lastPage() {
        this.setState({
            current_page: this.state.last_page,
        });
        this.changePage(this.state.last_page)
    }


    prevPage() {
        if (this.state.current_page > 0) {
            this.setState({current_page: --this.state.current_page});
            this.changePage(this.state.current_page);
        }
        console.log("prev", this.state.current_page)

    }

    nextPage() {
        if (this.state.current_page < this.state.last_page) {
            this.setState({current_page: ++this.state.current_page});
            this.changePage(this.state.current_page);
        }
        console.log("next", this.state.current_page)

    }

    changePage(page) {
        console.log("fetch", page)
        fetch(USERS_URL + '?page=' + page)
            .then(res => res.json())
            .then((result) => {
                let last_page = Math.ceil(result.total / this.state.each_page)
                this.setState({
                    users: result.data,
                    total: result.total,
                    last_page: last_page
                })
                console.log("current", this.state.current_page)
                console.log(result)
            });
    }


    render() {
        return (
            <div>
                <Table users={this.state.users}/>

                <section className="pagination">
                    <button className="first_page_btn" onClick={this.firstPage.bind(this)}
                            disabled={this.state.current_page === 0}>first
                    </button>
                    <button className="previous_page_btn" onClick={this.prevPage.bind(this)}
                            disabled={this.state.current_page === 0}>previous
                    </button>
                    <button className="next_page_btn" onClick={this.nextPage.bind(this)}
                            disabled={this.state.last_page === this.state.current_page}>next
                    </button>
                    <button className="last_page_btn" onClick={this.lastPage.bind(this)}
                            disabled={this.state.last_page === this.state.current_page}>last
                    </button>
                </section>
            </div>
        )
    }
}


function Table({users}) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user, i) => {
                return <tr>
                    <td key={i}> {user.id} </td>
                    <td key={i}> {user.first_name} </td>
                    <td key={i}> {user.last_name} </td>
                </tr>
            })}
            </tbody>
        </table>
    )
}

