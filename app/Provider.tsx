"use client";

import React from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerckUsers } from "@/lib/actions/user.actions";

function Provider({ children }: { children: React.ReactNode }) {
    return (
        <LiveblocksProvider
            resolveUsers={async ({ userIds }) => {
                const users = await getClerckUsers({ userIds });
                return users;
            }}
            authEndpoint="/api/liveblocks-auth"
        >
            <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<Loader />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}

export default Provider;
