"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { updateDocumentTitle } from "@/lib/actions/room.actions";
import Loader from "./Loader";
import ShareModal from "./ShareModal";

function CollaborativeRoom({
    roomId,
    roomMetadata,
    users,
    currentUserType,
}: CollaborativeRoomProps) {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, seDocumentTitle] = useState(roomMetadata.title);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const updateTitleHandler = async (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            setLoading(true);

            try {
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocumentTitle(
                        roomId,
                        documentTitle
                    );

                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
            } catch (err) {
                console.log(`Error while updating title ${err}`);
            }

            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutsideInput = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setEditing(false);
            }

            updateDocumentTitle(roomId, documentTitle);
        };

        document.addEventListener("mousedown", handleClickOutsideInput);

        return () =>
            document.removeEventListener("mousedown", handleClickOutsideInput);
    }, [documentTitle]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className="collaborative-room">
                    <Header>
                        <div
                            ref={containerRef}
                            className="flex w-fit items-center justify-center gap-2"
                        >
                            {editing && !loading ? (
                                <Input
                                    type="text"
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder="Enter title"
                                    onChange={(e) =>
                                        seDocumentTitle(e.target.value)
                                    }
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className="document-title-input"
                                />
                            ) : (
                                <>
                                    <p className="document-title">
                                        {documentTitle}
                                    </p>
                                </>
                            )}
                        </div>
                        {currentUserType === "editor" && !editing && (
                            <Image
                                src="/assets/icons/edit.svg"
                                alt="edit icon"
                                width={24}
                                height={24}
                                onClick={() => setEditing(true)}
                                className="pointer"
                            />
                        )}
                        {currentUserType !== "editor" && !editing && (
                            <p className="view-only-tag">View Only</p>
                        )}
                        {loading && <p className="text-gray-400 text-sm"></p>}
                        <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                            <ActiveCollaborators />
                            <ShareModal
                                roomId={roomId}
                                collaborators={users}
                                creatorId={roomMetadata.creatorId}
                                currentUserType={currentUserType}
                            />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor roomId={roomId} currentUserType={currentUserType} />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
}

export default CollaborativeRoom;
