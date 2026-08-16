import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
    return (
        <div style={{
            display: 'flex'
        }}>
            <h1>Admin Dashboard</h1>
            <LogoutButton className="btn"/>
        </div>
    )
}