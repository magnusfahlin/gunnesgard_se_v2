import React, {useState} from "react";
import SecureImage from "../../Common/SecureImage";
import {getApiRoot} from "../../../environmentConfig";
import delete_icon from "./delete_icon.png"
import "./AlbumEditor.scss"
import Spinner from "../../Common/Spinner";
import DropzoneWrapper from "./DropzoneWrapper";
import ProgressBar from "../../Common/ProgressBar";
import AlbumTitleEditor from "./AlbumTitleEditor";


const AlbumEditorExistingItem = (props) => {
    let icons =
        <div>
            <img src={delete_icon} onClick={() => props.deletePhoto(props.photo.id)}/>
        </div>;

    let photo = <SecureImage src={getApiRoot() + props.photo.thumbnailPath} token={props.token}/>;
    if (props.deleted) {
        icons = <div onClick={() => props.unDeletePhoto(props.photo.id)}>ångra</div>;
        photo = <div className="photo_deleted"><img src={delete_icon} title={"ta bort"}/></div>
    }

    let item =
        <div className="albumEditorExistingItem">
            <div className="photoContainer">
                {photo}
            </div>
            <div className={"fieldsContainer" + (props.deleted ? " photo_deleted_fields" : "")}>
                <div>
                    <input
                        type="text"
                        defaultValue={props.photo.title}
                        placeholder="Bildnamnn"
                        className="text"
                        disabled={props.deleted}
                        onChange={event => props.updatePhoto(props.photo.id, {title: event.target.value})}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        defaultValue={props.photo.text}
                        placeholder="Beskrivande text"
                        className="text"
                        disabled={props.deleted}
                        onChange={event => props.updatePhoto(props.photo.id, {text: event.target.value})}
                    />
                </div>
            </div>
            <div className={"iconsContainer" + (props.deleted ? " photo_deleted_icons" : "")}>
                <div className="icons">
                    {icons}
                </div>
            </div>
        </div>;
    return item;
}

const AddPhoto = (props) => {

    return (<DropzoneWrapper/>);
}

const AlbumEditor = (props) => {
    const [photosForDeletion, setPhotosForDeletion] = useState([]);
    const [photosForUpdate, setPhotosForUpdate] = useState({});
    const [albumDeletion, setAlbumDeletion] = useState(false);
    const [albumUpdate, setAlbumUpdate] = useState({});

    let photos = [...props.album.photos].reverse().map((photo, index) =>
        (<div className={"photoEditorPhoto" + index}>
            <AlbumEditorExistingItem
                photo={photo}
                token={props.token}
                deleted={photosForDeletion.includes(photo.id)}
                deletePhoto={(id) => setPhotosForDeletion([...photosForDeletion, id])}
                unDeletePhoto={(id) => {
                    setPhotosForDeletion(photosForDeletion.filter(existingId => existingId !== id))
                }}
                updatePhoto={(id, update) => {
                    photosForUpdate[id] = Object.assign(photosForUpdate[id] ?? {}, update);
                    setPhotosForUpdate(photosForUpdate);
                }}/>
        </div>));

    let status;
    if (props.albumModificationStatus?.loading) {
        status = <div><ProgressBar/></div>;
    } else if (props.albumModificationStatus?.errors) {
        status = props.albumModificationStatus.errors.map(error => {
            const operation = error.method == "DELETE" ? "ta bort" : "ändra";
            let title;
            if (error.id == props.album.id) {
                title = "albumet";
            } else {
                const photo = props.album.photos.find(p => p.id === error.id);
                title = photo.title ? photo.title : "bild nummer " + props.album.photos.indexOf(photo) + 1;
            }
            return <div>Kunde inte {operation} {title}</div>;
        })
    } else {
        status = <div>{photos.length} bilder</div>;
    }


    return <div className={"albumeditor"}>
        <div className={"controls"}>
            <div className={"status"}>{status}</div>
            <div className={"buttons"}>
                <button onClick={() => {
                    props.actions.modifyAlbum(props.album.id, albumDeletion, albumUpdate, photosForUpdate, photosForDeletion, props.token)
                    setAlbumDeletion(false);
                    setAlbumUpdate({});
                    setPhotosForUpdate({})
                    setPhotosForDeletion([]);
                }}>
                    Stäng
                </button>
            </div>
        </div>
        <div>
            <AlbumTitleEditor
                title={props.album.title}
                setTitle={(title) => {
                    setAlbumUpdate({title: title})
                }}
                showDeleteAlbum={true}
                deleteAlbum={() => {
                    setAlbumDeletion(true)
                }}
            />
        </div>
        <div>
            <DropzoneWrapper uploadPhoto={(file) => props.actions.createPhoto(props.id, file, props.token)}/>
        </div>
        <div>{photos}</div>
    </div>;
}
export default AlbumEditor;
