
export default function Sidebar() {
    return (
        <aside className="sidebar">
        <nav>
            <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/users">Users</a></li>
            <li><a href="/tests">Tests</a></li>
            <li><a href="/grade">Grades</a></li>
            <li><a href="/stats">Statistics</a></li>
            </ul>
        </nav>
        </aside>
    );
}