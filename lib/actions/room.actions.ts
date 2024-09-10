"use server";

import { getAccessType, parseStringify } from "./../utils";
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createDocument = async ({
    userId,
    email,
}: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled",
        };

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"],
        };

        const room = await liveblocks.createRoom(roomId, {
            defaultAccesses: [],
            metadata,
            usersAccesses,
        });

        revalidatePath("/");

        return parseStringify(room);
    } catch (err) {
        console.log(`Error while creating a room: ${err}`);
    }
};

export const getDocument = async ({
    roomId,
    userId,
}: {
    roomId: string;
    userId: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            throw new Error(`User ${userId} has no access to this document`);
        }

        return parseStringify(room);
    } catch (err) {
        console.log(`Error while getting a room: ${err}`);
    }
};

export const updateDocumentTitle = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: { title },
        });

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(error);
    }
};

export const getAllDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms);
    } catch (err) {
        console.log(`Error while getting a room: ${err}`);
    }
};

export const updateDocumentAccess = async ({
    roomId,
    email,
    userType,
    updatedBy,
}: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        };

        const room = await liveblocks.updateRoom(roomId, { usersAccesses });

        if (room) {
        }

        revalidatePath(`/documents/${roomId}`);
    } catch (err) {
        console.log(`Error while updating accesses: ${err}`);
    }
};

export const removeCollaborator = async ({
    roomId,
    email,
}: {
    roomId: string;
    email: string;
}) => {
    try {
        const room = liveblocks.getRoom(roomId);

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: { [email]: null },
        });

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (err) {
        console.log(`Error while removing collaborator: ${err}`);
    }
};

export const deleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath(`/`);
        redirect(`/`);
    } catch (err) {
        console.log(`Error while deleting document: ${err}`);
    }
};
