import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 25
        }}>
            <div style={{
                fontSize: 24
            }}>Admin Dashboard</div>
            <LogoutButton className="btn"/>
        </div>
    )
}