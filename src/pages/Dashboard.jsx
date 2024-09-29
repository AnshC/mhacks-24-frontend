import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes, deleteObject } from "firebase/storage";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { IoCloudUpload } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCircleRight } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";
import { HiLightningBolt } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";
import { FaRegFileImage } from "react-icons/fa";



import Button from '../components/Button'

export default function Dashboard () {

    const [firebaseUserObject, setUserObject] = useState({})
    const navigate = useNavigate();

    const [uploadState, setUploadState] = useState(false)
    const [searchState, setSearchState] = useState(true)
    const [profileState, setProfileState] = useState(false)

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {

              setUserObject(user)

            } else {

              navigate('/auth/log-in')

            }
          });
          
    })

    return (
        <div className="Dashboard">
            <div className="nav">
                <ul>
                    <li style={uploadState === true ? { color: 'var(--red)' } : {color: 'var(--dark)'}} onClick={(()=>{setUploadState(true); setProfileState(false); setSearchState(false)})}>
                        <IoCloudUpload className="icon"  />
                        Upload Record
                    </li>
                    <li style={searchState === true ? { color: 'var(--red)' } : {color: 'var(--dark)'}} onClick={(()=>{setSearchState(true); setProfileState(false); setUploadState(false)})}>
                        <IoSearchSharp className="icon" />
                        Search Files
                    </li>
                    <li style={profileState === true ? { color: 'var(--red)' } : {color: 'var(--dark)'}} onClick={(()=>{setProfileState(true); setUploadState(false); setSearchState(false)})}>
                        <FaUserCircle className="icon" />
                        Profile
                    </li>
                </ul>
            </div>
            <div className="main">
                <h1 id='main'>Welcome, <span className="red">{firebaseUserObject.email}</span></h1>
                <div className="content">
                    {uploadState === true ?
                        <Upload/>
                    :
                        profileState === true ?
                        <Profile />
                    :
                        <Search />
                    } 
                </div>
            </div>
        </div>
    )
}

function Profile () {

    const navigate = useNavigate();

    function signUserOut () {
        signOut(auth).then(()=>{
            navigate('/')
        })
    }

    return (
        <div className="Profile">
            <h2 className="main"><FaUserCircle className="icon" />Account Settings</h2>
            <p className="grey">Manage your HealthCloud Account.</p>
            <Button mode='red' className='logout' onClick={(()=>{signUserOut()})}>Log Out</Button>
        </div>
    )
}

function Search () {

    const navigate = useNavigate();

    var fileNameRaw;

    const [searchString, setSearchString] = useState("");   
    const [searchState, setSearchState] = useState(false);
    const [firebaseUserObject, setUserObject] = useState({
        email: ''
    });
    const [userFiles, setUserFiles] = useState([]);

    useEffect(()=>{
        const searchElement = document.getElementById("searchBar");
        searchElement.addEventListener("keydown", function (e) {
            if (e.code === "Enter") {
                setSearchState(true);
            }
        });
        
        onAuthStateChanged(auth, (user) => {
            if (user) {

              setUserObject(user)
              getUserFiles();

            } else {
              navigate('/auth/log-in')
            }
          });
    }, [])

    useEffect(()=>{
        getUserFiles()
    }, [firebaseUserObject])

    async function getUserFiles () {
        
        const storage = getStorage();
        const listRef = ref(storage, firebaseUserObject.uid+'/');

        const array = []
        
        listAll(listRef)
        .then((result)=>{
            const files = result.items;
            files.forEach((fileRef)=>{

                fileNameRaw = fileRef._location.path_;
                const newFileName = fileNameRaw.replace(firebaseUserObject.uid+'/', '')

                getDownloadURL(fileRef)
                .then((url)=>{


                    setUserFiles( userFiles => [...userFiles, {
                        name: newFileName,
                        link: url,
                        path: fileNameRaw
                    }])
                    
                })
            })
        })

    }

    return (
        <div className="Search">
            <h2 className="grey">Enter a prompt to view your related documents.</h2>
            <div className="bar">
                <input id="searchBar" type="text" placeholder="COVID-19 Vaccination Records" onInput={((e)=>{ setSearchString(e.target.value); setSearchState(false) })}/>
                <Button mode="red" className='button' onClick={(()=>{setSearchState(true)})}><IoSearchSharp className="icon" /></Button>
            </div>
            <div className="main">
                {searchState === false || searchString === "" ? <div className="prompt-container">
                    <h2 className="grey">
                        <FaInfoCircle className="icon" />
                        Enter medical record information & search to view document(s)
                    </h2>
                </div> :
                    <div className="search-result">
                        <p className="grey">Results for: "{searchString}"</p>
                    </div>
                }
            </div>
            <div className="myfiles">
                <div className="divide"></div>
                <h1>My Files</h1>
                <div className="file-list">
                {userFiles.map((file)=>{
                    return (
                        <div key={file.name} className="my-file-container" onClick={(()=>{
                            window.open(file.link, '_blank')
                        })}>
                            <FaRegFileImage className="icon" /><h2>{file.name}</h2>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

function Upload () {

    
    const storage = getStorage();

    const [firebaseUserObject, setUserObject] = useState({})
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [uploadState, setUploadState] = useState(false);

    const handleFileChange = (e) => {
        setUploadState(false);
        setFile(e.target.files[0]);
    }

    function uploadFile() {
        setUploadState(true);
        if (file === null) return;
        const uploadFile = file;
        setFileName(file.name);
        const fileRef = ref(storage, `${firebaseUserObject.uid}/${uploadFile.name}`)
        uploadBytes(fileRef, uploadFile).then((snapshot) => {
            console.log("uploaded!")
            addRecord()
            // API Parse Call
        })   
    }

    async function addRecord () {
        let today = new Date().toISOString().slice(0, 10)
        await addDoc(collection(db, "Files"), {
            email: firebaseUserObject.email,
            name: file.name,
            date: today
        });
    }

    useEffect(()=>{
        if (file != null) {
            setFileName(file.name)
        }
    }, [file])

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {

              setUserObject(user)

            } else {
              // User is signed out
              // ...
            }
          });
          
    })

    return (
        <div className="Upload">
            <div className="file-upload-container">
                <input type="file" id="uploadfile" onChange={((e)=>{handleFileChange(e)})}/>
                <label htmlFor="uploadfile" className="prompt">
                    {uploadState === false ? <IoAddCircleOutline className="icon" /> : <IoCheckmarkCircleOutline className="icon"/>}
                    <span className="text">{uploadState === false ? 'Click to add file' : fileName + ' Uploaded!'}</span>
                </label>
            </div>
            <Button className='button' mode="red" onClick={(()=>{uploadFile();})}>Upload {fileName != "" ? <span>{' '}{fileName} <FaCircleRight className="icon" /></span> : 'File'}</Button>
            <div className="grid">
                <div className="box">
                    <div className="head">
                        <FaFile className="icon" />
                        <h2>Upload .pdf</h2>
                    </div>
                    <p className="grey">Click and upload your medial records in a PDF format.</p>
                </div>
                <div className="box">
                    <div className="head">
                        <HiLightningBolt className="icon" />
                        <h2>AI Processing</h2>
                    </div>
                    <p className="grey">Our AI generates keywords based off the uploaded medical record, so that you can access your data within seconds</p>
                </div>
                <div className="box">
                    <div className="head">
                        <HiSparkles className="icon" />
                        <h2>Result</h2>
                    </div>
                    <p>Search for a few words based off the record you want, and our AI processes the request to send you your correct file</p>
                </div>
            </div>
        </div>
    )
}