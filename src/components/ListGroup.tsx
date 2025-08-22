import {useState} from "react";

interface ListGroupProps {
    items: string[],
    heading: string,
    onSelectItem: (item: string) => void,
}

export default function ListGroup({items, heading, onSelectItem}: ListGroupProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    return (
        <>
            <h1 className={"text-2xl"}>{heading}</h1>

            {items.length === 0 && <p>No items found</p>}

            <ul className="w-48 text-sm font-medium text-gray-900 divide-y-1 divide-gray-200 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                {
                    items.map((item, index) =>
                        <li key={item}
                            onClick={() => {
                                setSelectedIndex(index);
                                onSelectItem(item);
                            }}
                            className={"w-full px-4 py-2 cursor-pointer " + (index == 0 && "rounded-t-lg ") + (index == items.length - 1 && "rounded-b-lg ") + (selectedIndex == index && "bg-gray-100 dark:bg-gray-900")}>{item}</li>
                    )
                }
            </ul>
        </>
    );
}