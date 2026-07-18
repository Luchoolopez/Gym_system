import { hash, compare } from "bcryptjs";

export const encrypt = async (passText: string) => {
    const passwordHash = await hash(passText, 10);
    return passwordHash;
};

export const verified = async (passText: string, passHash: string) => {
    const isCorrect = await compare(passText, passHash);
    return isCorrect;
};
