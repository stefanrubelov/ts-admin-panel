import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {Api, type PetDto, type UpdatePetDto} from "../../../Api.ts";
import Button from "../../components/Button.tsx";
import {IconCircleCheck, IconCircleX} from "@tabler/icons-react";
import Modal from "../../components/Modal.tsx";
import LoadingSpinner from "../../components/LoadingSpinner.tsx";
import toast from "react-hot-toast";
import './pet-details.scss';

const api = new Api();

export default function PetDetails() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState<PetDto>();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isMarkAsSoldModalOpen, setMarkAsSoldModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.getPetById.petGetPetById({id: params.id})
            .then(response => response.json() as Promise<PetDto>)
            .then((data) => {
                const pet: PetDto = {
                    id: data.id,
                    name: data.name,
                    breed: data.breed,
                    imgurl: data.imgurl,
                    sold: data.sold,
                }
                setPet(pet);
                setLoading(false);
            })
    }, [params]);

    const onDelete = async () => {
        setLoading(true);
        try {
            if (pet) {
                const response = await api.deletePet.petDeletePet({id: pet.id});
                console.log(response);
                if (response.ok) {
                    setLoading(false);
                    setDeleteModalOpen(false);
                    toast.success("Pet deleted successfully, redirecting back.", {
                        position: "top-center",
                    });

                    setTimeout(() => navigate("/pets"), 2000);
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
        setLoading(false);
    }

    const onMarkAsSold = async () => {
        setLoading(true);
        try {
            if (pet) {
                const data: UpdatePetDto = {
                    id: pet.id,
                    name: pet.name,
                    breed: pet.breed,
                    imgurl: pet.imgurl,
                    sold: true
                };

                const response = await api.updatePet.petUpdatePet(data);
                if (response.ok) {
                    setPet({...pet, sold: true});

                    toast.success("Marked as sold!", {
                        position: "top-center",
                        duration: 3000
                    });
                    setLoading(false);
                    setMarkAsSoldModalOpen(false);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong,\n please try again later", {
                position: "top-center",
                duration: 4000
            });
        }
        setLoading(false);
    }

    if (loading) return <LoadingSpinner/>;

    return (
        <>
            {pet &&
                <div className={"pet-details-wrapper"}>
                    <div className={"pet-details-container"}>
                        <div>
                            <p className={"page-title"}>Pet details</p>
                        </div>

                        <div className={"buttons-container"}>
                            {!pet.sold &&
                                <Button size={"sm"} type="success" onClick={() => setMarkAsSoldModalOpen(true)}>
                                    Mark as sold
                                </Button>
                            }

                            {/*<Button size={"sm"} type="info" onClick={() => setDeleteModalOpen(true)}>*/}
                            {/*    Edit*/}
                            {/*</Button>*/}

                            <Button size={"sm"} type="error" onClick={() => setDeleteModalOpen(true)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div className={"main-container"}>
                        <div className={"image-container"}>

                            <img src={pet.imgurl} alt="{}"/>
                        </div>
                        <div className={"details-container"}>
                            <div className={"labels-container"}>
                                <p>Name:</p>
                                <p>Breed:</p>
                                <p>Sold:</p>
                            </div>
                            <div className={"values-container"}>
                                <p className={""}>{pet.name}</p>
                                <p>{pet.breed}</p>
                                <p>
                                    {
                                        pet.sold ?
                                            <IconCircleCheck className="icon text-green-500"/> :
                                            <IconCircleX className="icon text-red-500"/>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}
                   title="Are you sure you want to delete this pet?">
                <p className={"italic w-full text-center mt-0 pt-0"}>This action is irreversible</p>
                <div className="flex justify-between w-full mt-4">
                    <Button type="white" size="sm" onClick={() => setDeleteModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="error" size="sm" isSubmit={false} onClick={() => onDelete()}>
                        Delete
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={isMarkAsSoldModalOpen} onClose={() => setMarkAsSoldModalOpen(false)}
                   title="Are you sure you want to mark this pet as sold?">
                <p className={"italic w-full text-center mt-0 pt-0"}>This action is irreversible</p>
                <div className="flex justify-between w-full mt-4">
                    <Button type="white" size="sm" onClick={() => setMarkAsSoldModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="success" size="sm" isSubmit={false} onClick={() => onMarkAsSold()}>
                        Confirm
                    </Button>
                </div>
            </Modal>
        </>
    )
}
