"use client";

import React from "react";
import { Button } from "./ui/button";
import { createDocument } from "../lib/actions/room.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NewDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
    const router = useRouter();
    const addDocument = async () => {
        try {
            const room = await createDocument({ userId, email });
            if (room) {
                router.push(`/documents/${room.id}`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Button
            type="submit"
            onClick={addDocument}
            className="gradient-blue flex gap-1 shadow-md"
        >
            <Image
                src="/assets/icons/add.svg"
                alt="Add icon"
                width={24}
                height={24}
            />
            <p className="hidden sm:block">New document</p>
        </Button>
    );
};

export default NewDocumentBtn;
