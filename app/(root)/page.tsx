import Header from "@/components/Header";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import NewDocumentBtn from "@/components/NewDocumentBtn";
import { getAllDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";

const Home = async () => {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const documents = await getAllDocuments(
        clerkUser.emailAddresses[0].emailAddress
    );
    return (
        <main className="home-container">
            <Header className="sticky left-0 top-0">
                <div className="flex items-center lg:gap-4 gap-2">
                    Notifications
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </Header>

            {documents.data.length > 0 ? (
                <div className="document-list-container">
                    <div className="document-list-title">
                        <h3 className="text-28-semibold">All Documents</h3>
                        <NewDocumentBtn
                            userId={clerkUser.id}
                            email={clerkUser.emailAddresses[0].emailAddress}
                        />
                    </div>
                    <ul className="document-ul">
                        {documents.data.map(
                            ({ id, metadata, createdAt }: any) => (
                                <li key={id} className="document-list-item">
                                    <Link
                                        href={`/documents/${id}`}
                                        className="flex flex-1 items-center gap-4"
                                    >
                                        <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                                            <Image
                                                src="/assets/icons/doc.svg"
                                                alt="file cover"
                                                width={40}
                                                height={40}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="line-clamp-1 text-lg">
                                                {metadata.title}
                                            </p>
                                            <p className="font-light text-blue-100 text-sm">
                                                {dateConverter(createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                    <DeleteModal roomId={id} />
                                </li>
                            )
                        )}
                    </ul>
                </div>
            ) : (
                <div className="documents-list-empty">
                    <Image
                        src="/assets/icons/doc.svg"
                        alt="Document"
                        width={50}
                        height={50}
                        className="mx-auto my-5"
                    />
                    <NewDocumentBtn
                        userId={clerkUser.id}
                        email={clerkUser.emailAddresses[0].emailAddress}
                    />
                </div>
            )}
        </main>
    );
};

export default Home;
