import Header from "@/components/Header";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import NewDocumentBtn from "@/components/NewDocumentBtn";

const Home = async () => {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const documents = [];
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

            {documents.length > 0 ? (
                <div></div>
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
