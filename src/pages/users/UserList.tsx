import './user-list.scss';
import {useState} from "react";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import {IconBackhoe, IconBarrierBlock, IconBulldozer} from "@tabler/icons-react";

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
            <div className={"page-content "}>
                <IconBarrierBlock className={"icon"}/>
                <IconBulldozer className={"icon"}/>
                <p className={"title"}>Under construction</p>
                <IconBackhoe className={"icon"}/>
                <IconBarrierBlock className={"icon"}/>
            </div>        </>
    )
}
