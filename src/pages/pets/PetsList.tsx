import './pets-list.scss';
import {useEffect, useState} from "react";
import {Api, type CreatePetDto, type PetDto} from "../../../Api.ts";
import Button from "../../components/Button.tsx";
import {IconCircleCheck, IconCircleX, IconEdit, IconEye, IconTrash} from "@tabler/icons-react";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import Modal from "../../components/Modal.tsx";
import TextInput from "../../components/form/TextInput.tsx";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {Link} from "react-router";
import Dropdown from "../../components/form/Dropdown.tsx";

const api = new Api();

export default function PetsList() {
    const [pets, setPets] = useState<PetDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editingPet, setEditingPet] = useState<PetDto | null>(null)

    const openDeleteModal = (id: string) => {
        setSelectedId(id);
        setDeleteModalOpen(true);
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<CreatePetDto>()

    useEffect(() => {
        api.getPets.petGetPets()
            .then(res => res.json() as Promise<PetDto[]>)
            .then(data => {
                const pets: PetDto[] = data.map(item => ({
                    id: item.id,
                    name: item.name,
                    breed: item.breed,
                    imgurl: item.imgurl,
                    sold: item.sold,
                }))
                setPets(pets)
            })
            .catch(err => console.error("Error fetching pets:", err))
            .finally(() => setLoading(false))
    }, [])


    const onSubmit = async (data: CreatePetDto) => {
        try {
            setLoading(true)
            if (editingPet) {
                // edit mode
                const response = await api.updatePet.petUpdatePet({...editingPet, ...data})
                setPets(prev => prev.map(p => p.id === editingPet.id ? response.data : p))
                toast.success("Pet updated successfully.", {position: "top-center"})
            } else {
                // create mode
                const response = await api.createPet.petCreatePet(data as CreatePetDto)
                setPets(prev => [...prev, response.data])
                toast.success("New pet added successfully.", {position: "top-center"})
            }

            reset()
            setEditingPet(null)
            setCreateModalOpen(false)
        } catch (err) {
            console.error("Error saving pet:", err)
            toast.error("Something went wrong, please try again", {position: "top-center"})
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        if (!selectedId) return;
        const petId = selectedId;
        try {
            if (petId) {
                setLoading(true);
                const response = await api.deletePet.petDeletePet({id: petId});
                if (response.ok) {
                    const updatedPets = pets.filter(pet => pet.id !== petId);
                    setPets(updatedPets);
                    setLoading(false);
                    setDeleteModalOpen(false);
                    toast.success("Pet deleted successfully.", {
                        position: "top-center",
                    });
                    setSelectedId(null);
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong,\n please try again later", {
                position: "top-center",
                duration: 4000
            });
            setLoading(false);
            setDeleteModalOpen(false);
        }
    }

    const petOptions = {
        Dog: "Dog",
        Cat: "Cat",
        Parrot: "Parrot",
        Fish: "Fish",
        Hamster: "Hamster",
        Turtle: "Turtle",
        Snake: "Snake",
        Lizard: "Lizard",
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="w-full min-w-0 flex flex-col">
            <div className="flex flex-row items-center justify-between pb-6 w-full">
                <h2 className="page-title">Pet List</h2>
                <Button type="info" size="md" onClick={() => {
                    reset({
                        name: "",
                        breed: "",
                        imgurl: ""
                    });
                    setEditingPet(null);
                    setCreateModalOpen(true);
                }}>
                    Add new pet
                </Button>
            </div>

            <div className="relative overflow-x-auto shadow-md rounded-lg w-full min-w-0 flex-shrink">
                <table
                    className="pets-table w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-100 min-w-[800px]">
                    <thead>
                    <tr>
                        <th className="px-3 py-2 min-w-[50px]"></th>
                        <th className="px-3 py-2 min-w-[80px]">
                            #
                        </th>
                        <th className="px-3 py-2 min-w-[120px]">
                            Image
                        </th>
                        <th className="px-3 py-2 min-w-[120px]">
                            Name
                        </th>
                        <th className="px-3 py-2 min-w-[150px]">
                            Breed
                        </th>
                        <th className="px-3 py-2 min-w-[80px]">
                            Sold
                        </th>
                        <th className="px-3 py-2 min-w-[150px]">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {pets.map(pet => (
                        <tr key={pet.id}>
                            <td className="px-3 py-2 min-w-[50px]">
                                <input type="checkbox" className="accent-white bg-white"/>
                            </td>
                            <td className="px-3 py-2 min-w-[80px] whitespace-nowrap">
                                {pet.id}
                            </td>
                            <td className="px-3 py-2 min-w-[120px]">
                                <img src={pet.imgurl} alt={pet.name} height="90" width="90" className="mx-auto"/>
                            </td>
                            <td className="px-3 py-2 min-w-[120px] whitespace-nowrap">
                                {pet.name}
                            </td>
                            <td className="px-3 py-2 min-w-[150px]">
                                {pet.breed}
                            </td>
                            <td className="px-3 py-2 min-w-[80px]">
                                {
                                    pet.sold ?
                                        <IconCircleCheck className="icon text-green-500"/> :
                                        <IconCircleX className="icon text-red-500"/>
                                }
                            </td>
                            <td className="px-3 py-2 min-w-[150px]">
                                <div className="flex flex-row items-center justify-center space-x-2">
                                    <Button size="xs" type="transparent">
                                        <Link to={{
                                            pathname: `/pets/${pet.id}`,
                                        }}>
                                            <IconEye className="text-green-500"/>
                                        </Link>
                                    </Button>
                                    <Button size="xs" type="transparent" onClick={() => {
                                        setEditingPet(pet)
                                        reset(pet)
                                        setCreateModalOpen(true)
                                    }}>
                                        <IconEdit className="text-indigo-500"/>
                                    </Button>
                                    <Button size="xs" type="transparent" onClick={() => openDeleteModal(pet.id!)}>
                                        <IconTrash className="text-red-500"/>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/*modal for create/edit*/}
            <Modal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Pet">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <TextInput
                        name="name"
                        registration={register("name", {required: "Name is required"})}
                        error={errors.name}
                    />

                    <Dropdown name={"breed"}
                              options={petOptions}
                              registration={register("breed", {required: "Breed is required"})}
                              error={errors.breed}
                              defaultValue={editingPet?.breed}
                    />

                    <TextInput
                        name="imgurl"
                        label="Image URL"
                        registration={register("imgurl", {
                            required: "Image URL is required",
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: "Must be a valid URL"
                            }
                        })}
                        error={errors.imgurl}
                    />

                    <div className="flex justify-between w-full mt-6">
                        <Button type="white" size="md" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="success" size="md" isSubmit={true}>
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>

            {/*modal for delete*/}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}
                   title="Are you sure you want to delete this pet?">
                <p className={"italic w-full dark:text-white text-gray-700 text-center mt-0 pt-0"}>This action is
                    irreversible</p>
                <div className="flex justify-between w-full mt-4">
                    <Button type="white" size="sm" onClick={() => setDeleteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="error" size="sm" isSubmit={false} onClick={() => onDelete()}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
