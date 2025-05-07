import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/**
 * Get all movie lists for the authenticated user
 */
export async function getUserLists() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { error: "Unauthorized", status: 401 };
    }

    try {
        const lists = await prisma.movieList.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                _count: {
                    select: { items: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return { lists };
    } catch (error) {
        console.error("Error fetching user lists:", error);
        return { error: "Failed to fetch lists", status: 500 };
    }
}

/**
 * Get lists that the user follows (other users' public lists)
 */
export async function getFollowedLists() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { error: "Unauthorized", status: 401 };
    }

    try {
        // Get users that the current user follows
        const following = await prisma.follower.findMany({
            where: {
                followerId: session.user.id
            },
            select: {
                followedId: true
            }
        });

        const followedUserIds = following.map((f: { followedId: string }) => f.followedId);

        // Get public lists from these users
        const lists = await prisma.movieList.findMany({
            where: {
                userId: { in: followedUserIds },
                isPublic: true
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profilePicture: true
                    }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return { lists };
    } catch (error) {
        console.error("Error fetching followed lists:", error);
        return { error: "Failed to fetch followed lists", status: 500 };
    }
}

/**
 * Get popular lists based on number of followers
 */
export async function getPopularLists() {
    try {
        // Get public lists with user info and item count
        const lists = await prisma.movieList.findMany({
            where: {
                isPublic: true
            },
            include: {
                user: {
                    select: {
                        username: true,
                        profilePicture: true
                    }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            },
            take: 9 // Limit to top 9 for now
        });

        return { lists };
    } catch (error) {
        console.error("Error fetching popular lists:", error);
        return { error: "Failed to fetch popular lists", status: 500 };
    }
}

/**
 * Create a new movie list
 */
export async function createList(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, description, isPublic = true } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const newList = await prisma.movieList.create({
            data: {
                name,
                description,
                isPublic,
                userId: session.user.id
            }
        });

        return NextResponse.json({ list: newList });
    } catch (error) {
        console.error("Error creating list:", error);
        return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
    }
}

/**
 * Add movie to list
 */
export async function addMovieToList(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { listId, movieId, notes } = await req.json();

        // Check if list belongs to user
        const list = await prisma.movieList.findFirst({
            where: {
                id: listId,
                userId: session.user.id
            }
        });

        if (!list) {
            return NextResponse.json({ error: "List not found or access denied" }, { status: 404 });
        }

        // Add movie to list
        const listItem = await prisma.movieListItem.create({
            data: {
                listId,
                movieId,
                notes
            }
        });

        return NextResponse.json({ success: true, item: listItem });
    } catch (error) {
        console.error("Error adding movie to list:", error);
        return NextResponse.json({ error: "Failed to add movie to list" }, { status: 500 });
    }
}

/**
 * Remove movie from list
 */
export async function removeMovieFromList(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { listId, movieId } = await req.json();

        // Check if list belongs to user
        const list = await prisma.movieList.findFirst({
            where: {
                id: listId,
                userId: session.user.id
            }
        });

        if (!list) {
            return NextResponse.json({ error: "List not found or access denied" }, { status: 404 });
        }

        // Remove movie from list
        await prisma.movieListItem.delete({
            where: {
                listId_movieId: {
                    listId,
                    movieId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing movie from list:", error);
        return NextResponse.json({ error: "Failed to remove movie from list" }, { status: 500 });
    }
}

/**
 * Get list details with movies
 */
export async function getListDetails(listId: string) {
    try {
        const list = await prisma.movieList.findUnique({
            where: { id: listId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true
                    }
                },
                items: {
                    include: {
                        movie: true
                    }
                }
            }
        });

        if (!list) {
            return { error: "List not found", status: 404 };
        }

        // If list is not public, check if user is owner
        const session = await getServerSession(authOptions);
        if (!list.isPublic && (!session?.user || session.user.id !== list.userId)) {
            return { error: "This list is private", status: 403 };
        }

        return { list };
    } catch (error) {
        console.error("Error fetching list details:", error);
        return { error: "Failed to fetch list details", status: 500 };
    }
}