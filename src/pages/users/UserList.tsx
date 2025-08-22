import './user-list.scss';
import {useState} from "react";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";

export default function UserList() {
    const [loading, setLoading] = useState(true);
    setTimeout(
        () => setLoading(false),
        300
    )
    if (loading) return <LoadingSpinner/>;

    return (
        <>
            <div className={"page-title"}>Users</div>
        </>
    )
}
