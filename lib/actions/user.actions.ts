"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

export const getClerckUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) =>
            users.find((user) => user.email === email)
        );
        return parseStringify(sortedUsers);
    } catch (err) {
        console.log(`Error fetching users: ${err}`);
    }
};
