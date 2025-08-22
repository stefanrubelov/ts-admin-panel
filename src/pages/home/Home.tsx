import './home.scss';
import {useState} from "react";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";

export default function Home() {
    const [loading, setLoading] = useState(true);
    setTimeout(
        () => setLoading(false),
        300
    )
    if (loading) return <LoadingSpinner/>;

    return (
        <>
            <div className={"page-title"}>Home</div>
        </>
    )
}
