interface User {
    id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    avatar: string;
    username: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
    last_active?: Date;
}

interface Chat {
    to: User;
    last_message: Message;
}

interface Message {
    id: string;
    text: string;
    from: string;
    to: string;
    created_at: Date;
}
