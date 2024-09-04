export interface Entry extends BaseEntry {
    _id: string;
    updated_at: string;
}

export interface BaseEntry {
    is_note?: boolean;
    user_id: User["_id"];
    content: string;
    created_at: string;
}

export interface User extends BaseUser {
    _id: string;
}

export interface BaseUser {
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    created_at: string;
}

export interface Payload {
    id: User["_id"];
}

declare global {
    namespace Express {
        export interface Request {
            user: Payload;
        }
    }
}
